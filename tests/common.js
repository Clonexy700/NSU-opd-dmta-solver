
function buildFakeCanvas(){
	return {
		getContext : function() { return null; }
	}
}


export{
	buildFakeCanvas
}