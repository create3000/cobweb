
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
		custom: true,
		geometryTypeValue: 3,
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

			this .setShading (this .getBrowser () .getBrowserOptions () .Shading_ .getValue ());
		},
		getGeometryType: function ()
		{
			return this .geometryTypeValue;
		},
		setShading: function (shading)
		{
			var gl = this .getBrowser () .getContext ();

			switch (this .geometryTypeValue)
			{
				case 0:
				{
					switch (shading)
					{
						case "POINT":
						case "POINTSET":
						{
							this .primitiveMode = gl .POINTS;
							this .wireframe     = true;
							break;
						}
						case "WIREFRAME":
						{
							this .primitiveMode = gl .POINTS;
							this .wireframe     = true;
							break;
						}
						default:
						{
							// case FLAT:
							// case GOURAUD:
							// case PHONG:
		
							this .primitiveMode = gl .POINTS;
							this .wireframe     = true;
							break;
						}
					}

					break;
				}
				case 1:
				{
					switch (shading)
					{
						case "POINT":
						case "POINTSET":
						{
							this .primitiveMode = gl .POINTS;
							this .wireframe     = true;
							break;
						}
						case "WIREFRAME":
						{
							this .primitiveMode = gl .LINES;
							this .wireframe     = true;
							break;
						}
						default:
						{
							// case FLAT:
							// case GOURAUD:
							// case PHONG:

							this .primitiveMode = gl .LINES;
							this .wireframe     = true;
							break;
						}
					}

					break;
				}
				case 2:
				case 3:
				{
					switch (shading)
					{
						case "POINT":
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
						default:
						{
							// case FLAT:
							// case GOURAUD:
							// case PHONG:
		
							this .primitiveMode = gl .TRIANGLES;
							this .wireframe     = false;
							break;
						}
					}	

					break;
				}
			}
		},
	});

	return X3DShaderNode;
});


