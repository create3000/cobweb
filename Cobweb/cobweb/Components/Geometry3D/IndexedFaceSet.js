
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
	with (Fields)
	{
		function IndexedFaceSet (executionContext)
		{
			X3DComposedGeometryNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .IndexedFaceSet);
		}

		IndexedFaceSet .prototype = $.extend (new X3DComposedGeometryNode (),
		{
			constructor: IndexedFaceSet,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",        new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",           new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "ccw",             new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "convex",          new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "creaseAngle",     new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "colorPerVertex",  new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "normalPerVertex", new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "texCoordIndex",   new MFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "colorIndex",      new MFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "normalIndex",     new MFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "coordIndex",      new MFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "attrib",          new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "fogCoord",        new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "color",           new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "texCoord",        new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "normal",          new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "coord",           new SFNode ()),
			]),
			getTypeName: function ()
			{
				return "IndexedFaceSet";
			},
			getComponentName: function ()
			{
				return "Geometry3D";
			},
			getContainerField: function ()
			{
				return "geometry";
			},
		});

		return IndexedFaceSet;
	}
});

