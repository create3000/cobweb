
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

	function X3DShaderNode (executionContext)
	{
		X3DAppearanceChildNode .call (this, executionContext);

		this .addType (X3DConstants .X3DShaderNode);
	}

	X3DShaderNode .prototype = $.extend (Object .create (X3DAppearanceChildNode .prototype),
	{
		constructor: X3DShaderNode,
		pointsValue: false,
		geometryTypeValue: 3,
		custom: true,
		shading: "GOURAUD",
		setCustom: function (value)
		{
			this .custom = value;
		},
		getCustom: function ()
		{
			return this .custom;
		},
		setGeometryType: function (value)
		{
			this .geometryTypeValue = value;

			this .use ();
			this .getBrowser () .getContext () .uniform1i (this .geometryType, value);
		},
		getGeometryType: function ()
		{
			return this .geometryTypeValue;
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
					break;
				}
				case "WIREFRAME":
				{
					this .primitiveMode = gl .LINE_LOOP;
					this .wireframe     = true;
					break;
				}
				case "PHONG":
				{
					this .primitiveMode = gl .TRIANGLES;
					this .wireframe     = false;
					break;
				}
				default:
				{
					this .primitiveMode = gl .TRIANGLES;
					this .wireframe     = false;
					break;
				}
			}
		},
		getShading: function ()
		{
			return this .shading;
		},
	});

	return X3DShaderNode;
});


