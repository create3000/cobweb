
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
	with (Fields)
	{
		function X3DAppearanceNode (browser, executionContext)
		{
			X3DNode .call (this, browser, executionContext);

			this .addType (X3DConstants .X3DAppearanceNode);
		}

		X3DAppearanceNode .prototype = $.extend (Object .create (X3DNode .prototype),
		{
			constructor: X3DAppearanceNode,
			initialize: function ()
			{
				X3DNode .prototype .initialize .call (this);
				
				this .addChildren ("isTransparent", new SFBool ());
			},
		});

		return X3DAppearanceNode;
	}
});

