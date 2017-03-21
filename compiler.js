#!/usr/bin/env node

let babel = require('babel-core');
let fs = require('fs');
let path = require('path');
let RunDir = path.resolve(__dirname);
let Promise = require("bluebird");

function read(path, callback){
	fs.readFile(path, 'utf-8', function(err, data){
		callback(data);
	});
};

function write(path, content, callback){
	fs.writeFile(path, content, callback);
};

let entry = 'src/index.jsx';
let outpath = 'public/compiled.js';

let depQueue = [];
let resolvedDeps = {};
depQueue.push(entry);
let modTree = [];

let parseMod = function(path, callback){
	console.log('-- parse path -> '+path);
	let define = function(dep, fac){
		let mod = {
			id: path,
			dep: dep,
			fac: fac
		};
		callback(mod);
	};
	read(path, function(data){
		let code = babel.transform(data, {'presets':['es2015','stage-2','react'], "plugins": ["transform-es2015-modules-amd"] }).code;
		eval(code);
	});
};

let digestDepQueue = function(){
	let modPath = depQueue.shift();
	if(modPath && !resolvedDeps[modPath]){
		//分析一条依赖
		parseMod(modPath, function(mod){
			modTree.push(mod);
			let tmp;
			for(let i=0; i<mod.dep.length; i++){
				tmp = mod.dep[i];
				if(tmp.indexOf('.')==0){
					let resolvedPath = path.resolve( path.dirname(modPath), mod.dep[i]);
					//不能加./，会被require认为需要按路径加载
					let relativePath = path.relative('./', resolvedPath);
					mod.dep[i] = relativePath;
					depQueue.push(relativePath);
					console.log('-- add path --> '+mod.dep[i]);
					//记录已经遍历过的路径及对应模块防止重复遍历
					resolvedDeps[modPath];
					//继续下一个
					digestDepQueue();
				}else{
					// ? 最大的问题是，公共模块和自己写的模块并不一样，不能如期转换，也不能进行依赖分析

					//按照约定，公共模块x的发行版存在于 node_modules/{x}/{x}.js 或 node_modules/{x}/dist/{x}.js 或 node_modules/{x}/dist/js/{x}.js
					// let path1 = path.relative('./', RunDir+'/node_modules/'+mod.dep[i]+'/'+mod.dep[i]+'.js');
					// let path2 = path.relative('./', RunDir+'/node_modules/'+mod.dep[i]+'/dist/'+mod.dep[i]+'.js');
					// let path3 = path.relative('./', RunDir+'/node_modules/'+mod.dep[i]+'/dist/js/'+mod.dep[i]+'.js');

					// let p1 = new Promise(function(resolve, reject) { 
					// 	fs.exists(path1, function(is){
					// 		if(is){
					// 			resolve(path1);
					// 		};
					// 	});
					// });

					// let p2 = new Promise(function(resolve, reject) { 
					// 	fs.exists(path2, function(is){
					// 		if(is){
					// 			resolve(path2);
					// 		};
					// 	});
					// });

					// let p3 = new Promise(function(resolve, reject) { 
					// 	fs.exists(path3, function(is){
					// 		if(is){
					// 			resolve(path3);
					// 		};
					// 	});
					// });
					
					// Promise.race([p1,p2,p3]).then(function(path){
					// 	depQueue.push(path);
					// 	console.log('-- add path --> '+path);
					// 	//记录已经遍历过的路径及对应模块防止重复遍历
					// 	resolvedDeps[path];
					// 	//继续下一个
					// 	digestDepQueue();
					// });
				}
			};
			
		});
	}else{
		//分析结束
		console.log('-- complete --> '+outpath);
		write(outpath, (function(){
			let mod, output = [];
			for(let i = modTree.length-1; i>=0; i--){
				mod = modTree[i];
				output.push('define("'+mod.id+'", ["'+mod.dep.join('", "')+'"], '+mod.fac.toString()+')');
			};
			output.push('require(["'+entry+'"])');
			return output.join(';\n\n');
		})());
	};
};

digestDepQueue();