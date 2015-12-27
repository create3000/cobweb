
define ([
	"jquery",
	"cobweb/Components/Shape/X3DAppearanceChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DAppearanceChildNode, 
          X3DConstants)
{
"use strict";

	function X3DShaderNode (browser, executionContext)
	{
		X3DAppearanceChildNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DShaderNode);
	}

	X3DShaderNode .prototype = $.extend (Object .create (X3DAppearanceChildNode .prototype),
	{
		constructor: X3DShaderNode,
		shading: "GOURAUD",
		getShading: function ()
		{
			return this .shading;
		},
		setShading: function (shading)
		{
			var gl = this .getBrowser () .getContext ();

			this .shading = shading;

			switch (shading)
			{
				case "POINTSET":
				{
					this .primitiveMode = gl .POINTS;
					this .wireframe     = true;
	
					this .use ();
					gl .uniform1i (this .points, true);
					break;
				}
				case "WIREFRAME":
				{
					this .primitiveMode = gl .LINE_LOOP;
					this .wireframe     = true;
	
					this .use ();
					gl .uniform1i (this .points, false);
					break;
				}
				case "PHONG":
				{
					this .primitiveMode = gl .TRIANGLES;
					this .wireframe     = false;
	
					this .use ();
					gl .uniform1i (this .points, false);
					break;
				}
				default:
				{
					this .primitiveMode = gl .TRIANGLES;
					this .wireframe     = false;
	
					this .use ();
					gl .uniform1i (this .points, false);
					break;
				}
			}
		},
	});

	return X3DShaderNode;
});


