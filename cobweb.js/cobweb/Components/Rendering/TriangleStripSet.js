
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DComposedGeometryNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DComposedGeometryNode, 
          X3DConstants)
{
"use strict";

	function TriangleStripSet (executionContext)
	{
		X3DComposedGeometryNode .call (this, executionContext);

		this .addType (X3DConstants .TriangleStripSet);

		this .triangleIndex = [ ];
	}

	TriangleStripSet .prototype = $.extend (Object .create (X3DComposedGeometryNode .prototype),
	{
		constructor: TriangleStripSet,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",        new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",           new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "ccw",             new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "colorPerVertex",  new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "normalPerVertex", new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "stripCount",      new Fields .MFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "attrib",          new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "fogCoord",        new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "color",           new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "texCoord",        new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "normal",          new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "coord",           new Fields .SFNode ()),
		]),
		getTypeName: function ()
		{
			return "TriangleStripSet";
		},
		getComponentName: function ()
		{
			return "Rendering";
		},
		getContainerField: function ()
		{
			return "geometry";
		},
		initialize: function ()
		{
			X3DComposedGeometryNode .prototype .initialize .call (this);
		
			this .stripCount_ .addInterest (this, "set_stripCount__");
		
			this .set_stripCount__ ();
		},
		set_stripCount__: function ()
		{
			// Build coordIndex

			var
				stripCount    = this .stripCount_ .getValue (),
				triangleIndex = this .triangleIndex;

			triangleIndex .length = 0;

			for (var s = 0, strips = stripCount .length, index = 0; s < strips; ++ s)
			{
				var vertexCount = stripCount [s] .getValue ()

				for (var i = 0, count = vertexCount - 2; i < count; ++ i)
				{
					var is_odd = i & 1;

					triangleIndex .push (index + (is_odd ? i + 1 : i),
					                     index + (is_odd ? i : i + 1),
					                     index + (i + 2));
				}

				index += vertexCount;
			}
		},
		getPolygonIndex: function (index)
		{
			return this .triangleIndex [index];
		},
		build: function ()
		{
			X3DComposedGeometryNode .prototype .build .call (this, 3, this .triangleIndex .length, 3, this .triangleIndex .length);
		},
	});

	return TriangleStripSet;
});


