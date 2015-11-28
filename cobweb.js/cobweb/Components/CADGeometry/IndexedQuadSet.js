
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

	function IndexedQuadSet (executionContext)
	{
		X3DComposedGeometryNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .IndexedQuadSet);

		this .triangleIndex = [ ];
	}

	IndexedQuadSet .prototype = $.extend (Object .create (X3DComposedGeometryNode .prototype),
	{
		constructor: IndexedQuadSet,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",        new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",           new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "ccw",             new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "colorPerVertex",  new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "normalPerVertex", new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "index",           new Fields .MFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "attrib",          new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "fogCoord",        new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "color",           new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "texCoord",        new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "normal",          new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "coord",           new Fields .SFNode ()),
		]),
		getTypeName: function ()
		{
			return "IndexedQuadSet";
		},
		getComponentName: function ()
		{
			return "CADGeometry";
		},
		getContainerField: function ()
		{
			return "geometry";
		},
		initialize ()
		{
			X3DComposedGeometryNode .prototype .initialize .call (this);
		
			this .index_ .addInterest (this, "set_index__");
		
			this .set_index__ ();
		},
		set_index__: function ()
		{
			var
				index         = this .index_ .getValue (),
				length        = index .length,
				triangleIndex = this .triangleIndex;

			length -= length % 4;
			triangleIndex .length = 0;

			for (var i = 0; i < length; i += 4)
			{
				var
					i0 = i,
					i1 = i + 1,
					i2 = i + 2,
					i3 = i + 3;

				triangleIndex .push (i0, i1, i2,  i0, i2, i3);
			}
		},
		getTriangleIndex: function (i)
		{
			return this .triangleIndex [i];
		},
		getPolygonIndex: function (i)
		{
			return this .index_ [i];
		},
		build: function ()
		{
			X3DComposedGeometryNode .prototype .build .call (this, 4, this .index_ .length, 6, this .triangleIndex .length);
		},
	});

	return IndexedQuadSet;
});


