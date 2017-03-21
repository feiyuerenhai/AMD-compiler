//dumb UI components that know nothing but receiving props from smart components

import React from 'react';

class Greeting extends React.Component{
	get name(){
		return this.props.name;
	}
	render(){
		//below are two components that do not interact but send only unidirectional actions to state
		return (
			<div>
				<span>hi {this.props.name}, how are you ?</span>
				<br/>
				<input onChange={(e)=>{this.props.change(e.target.value)}} value={this.name} />
				<button onClick={(e)=>{this.props.remove()}}>删除</button>
			</div>
		)
	}
}

export default Greeting;