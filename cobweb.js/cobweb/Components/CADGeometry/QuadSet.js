
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
		function QuadSet (executionContext)
		{
			X3DComposedGeometryNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .QuadSet);
		}

		QuadSet .prototype = $.extend (new X3DComposedGeometryNode (),
		{
			constructor: QuadSet,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",        new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",           new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "ccw",             new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "colorPerVertex",  new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "normalPerVertex", new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "attrib",          new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "fogCoord",        new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "color",           new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "texCoord",        new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "normal",          new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "coord",           new SFNode ()),
			]),
			getTypeName: function ()
			{
				return "QuadSet";
			},
			getComponentName: function ()
			{
				return "CADGeometry";
			},
			getContainerField: function ()
			{
				return "geometry";
			},
		});

		return QuadSet;
	}
});

