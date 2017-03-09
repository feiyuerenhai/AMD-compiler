let babel = require('babel-core');
let fs = require('fs');
let path = require('path');

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

let digestlDepQueue = function(){
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
				};
			};
			digestlDepQueue();
		});
	}else{
		//分析结束
		console.log('-- complete --');
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

digestlDepQueue();