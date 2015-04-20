
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DNode, 
          X3DConstants)
{
	function X3DProtoDeclarationNode (browser, executionContext)
	{
		X3DNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DProtoDeclarationNode);
	}

	X3DProtoDeclarationNode .prototype = $.extend (Object .create (X3DNode .prototype),
	{
		constructor: X3DProtoDeclarationNode,
		hasUserDefinedFields: function ()
		{
			return true;
		},
	});

	return X3DProtoDeclarationNode;
});
