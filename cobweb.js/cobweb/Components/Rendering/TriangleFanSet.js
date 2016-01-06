
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

	function TriangleFanSet (executionContext)
	{
		X3DComposedGeometryNode .call (this, executionContext);

		this .addType (X3DConstants .TriangleFanSet);

		this .triangleIndex = [ ];
	}

	TriangleFanSet .prototype = $.extend (Object .create (X3DComposedGeometryNode .prototype),
	{
		constructor: TriangleFanSet,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",        new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",           new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "ccw",             new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "colorPerVertex",  new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "normalPerVertex", new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "fanCount",        new Fields .MFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "attrib",          new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "fogCoord",        new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "color",           new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "texCoord",        new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "normal",          new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "coord",           new Fields .SFNode ()),
		]),
		getTypeName: function ()
		{
			return "TriangleFanSet";
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
		
			this .fanCount_ .addInterest (this, "set_fanCount__");
		
			this .set_fanCount__ ();
		},
		set_fanCount__: function ()
		{
			// Build coordIndex

			var
				fanCount      = this .fanCount_ .getValue (),
				triangleIndex = this .triangleIndex;
		
			triangleIndex .length = 0;

			for (var f = 0, fans = fanCount .length, index = 0; f < fans; ++ f)
			{
				var vertexCount = fanCount [f] .getValue ()

				for (var i = 1, count = vertexCount - 1; i < count; ++ i)
				{
					triangleIndex .push (index, index + i, index + i + 1);
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

	return TriangleFanSet;
});


