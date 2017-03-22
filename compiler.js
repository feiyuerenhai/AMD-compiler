#!/usr/bin/env node

let chalk = require('chalk');
let babel = require('babel-core');
let fs = require('fs');
let path = require('path');
let __rootdir = path.resolve(__dirname);
let Promise = require("bluebird");

//读文件
function read(path, callback){
	fs.readFile(path, 'utf-8', function(err, data){
		callback(data);
	});
};
//写文件
function write(path, content, callback){
	fs.writeFile(path, content, callback);
};
//判断可能的多路径中第一个存在的文件路径
function exist(queue, callback){
	queue = queue || [];
	let _exists = function(){
		let path = queue.shift();
		fs.exists(path, function(is){
			if(is){
				callback(path);
			}else{
				_exists();
			};
		});
	};
	_exists();
};

let readPublicModuleCodeAsAMD = function(mod_name, callback){
	let queue = [];
	queue.push(path.relative('./', __rootdir+'/node_modules/'+mod_name+'/dist/'+mod_name+'.js'));
	queue.push(path.relative('./', __rootdir+'/node_modules/'+mod_name+'/dist/js/'+mod_name+'.js'));
	queue.push(path.relative('./', __rootdir+'/node_modules/'+mod_name+'/'+mod_name+'.js'));
	exist(queue, function(path){
		read(path, function(code_str){
			//公共依赖模块不转码直接使用
			let code = code_str;
			callback(code);
		});
	});
};

let readLocalModuleCodeAsAMD = function(path, callback){
	read(path, function(code_str){
		//本地项目ES6模块babel转码为AMD格式
		let code = babel.transform(code_str, {'presets':['es2015','stage-2','react'], "plugins": ["transform-es2015-modules-amd"] }).code;
		callback(code);
	});
};

let parsedModules = {};
let parseModuleFromPath = function(path, callback){
	//已经解析过的模块直接从缓存取
	if(parsedModules[path]){
		// console.log(chalk.gray('⎔ resolved → '+path));
		callback(parsedModules[path]);
		return;
	};
	//取当前队列首第一条依赖
	console.log(chalk.magenta('⎔ parse → '+path));
	//~利用作用域让模块误以为自己处于amd环境中
	let module = undefined,
	exports = undefined,
	define = function(dep, fac){
		let mod = {
			id: path,
			dep: dep,
			fac: fac
		};
		//记录已经遍历过的路径及对应模块防止重复遍历
		parsedModules[path] = mod;
		//出口回调
		callback(mod);
	};
	define.amd = true;
	//作用域内执行模块代码，从而获取匿名模块的依赖以及工厂函数，并通过callback导出
	if(path.indexOf('.')>=0){
		readLocalModuleCodeAsAMD(path, function(code){
			eval(code);
		});
	}else{
		readPublicModuleCodeAsAMD(path, function(code){
			eval(code);
		});
	}
};

let entry = 'src/index.jsx';
let outpath = 'public/compiled.js';

let depQueue = [entry];
//入口
console.log(chalk.bold.green('► start → '+entry));
let modTree = [];
let digestDepQueue = function(){
	let modPath = depQueue.shift();
	if(modPath){
		parseModuleFromPath(modPath, function(mod){
			//无论是否解析过该模块，都将其追加到队尾，这样能将底层依赖逐渐漂浮到队尾
			modTree.push(mod);
			//遍历当前模块依赖，获取依赖路径
			for(let i=0; i<mod.dep.length; i++){
				let one_dep = mod.dep[i];
				if(one_dep.indexOf('.')==0){
					//本地模块路径，将其相对根目录的路径推到队尾
					let resolvedPath = path.resolve( path.dirname(modPath), one_dep);
					//不能加./，会被require认为需要按路径加载
					let relativePath = path.relative(__rootdir, resolvedPath);
					one_dep = relativePath;
					depQueue.push(relativePath);
					console.log(chalk.gray('⎔ depend → '+one_dep));
				}else{
					//公共模块路径，除了核心模块外全部直接推到队列尾
					if( !(/define|require|module|exports/.test(one_dep)) ){
						depQueue.push(one_dep);
						console.log(chalk.gray('⎔ depend → '+one_dep));
					};
				}
			};
			digestDepQueue();
		});
	}else{
		//队列消化完成则分析结束
		let depSnake = [];
		write(outpath, (function(){
			let mod, output = [], written = {};
			//反转依赖树
			modTree.reverse().forEach(function(mod){
				//去重
				if(!written[mod.id]){
					//记录反转、合并之后的依赖树
					depSnake.push(mod.id);
					//
					output.push('define("'+mod.id+'", ["'+mod.dep.join('", "')+'"], '+mod.fac.toString()+')');
					written[mod.id] = true;
				};
			});
			//追加require启动入口
			output.push('require(["'+entry+'"])');
			//内容输出
			return output.join(';\n\n');
		})());
		let time_complete = new Date();
		console.log(chalk.blue('⎔ tree → '+chalk.italic(depSnake.join(' ▸ '))));
		console.log(chalk.bold.green('✔ complete → '+outpath+' (in '+(time_complete - time_start)+'ms)'));
	};
};

let time_start = new Date();
digestDepQueue();