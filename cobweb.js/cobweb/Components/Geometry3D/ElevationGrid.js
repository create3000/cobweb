
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DGeometryNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGeometryNode, 
          X3DConstants)
{
	with (Fields)
	{
		function ElevationGrid (executionContext)
		{
			X3DGeometryNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .ElevationGrid);
		}

		ElevationGrid .prototype = $.extend (new X3DGeometryNode (),
		{
			constructor: ElevationGrid,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",        new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "xDimension",      new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "zDimension",      new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "xSpacing",        new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "zSpacing",        new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",           new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "ccw",             new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "creaseAngle",     new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "colorPerVertex",  new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "normalPerVertex", new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "attrib",          new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "fogCoord",        new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "color",           new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "texCoord",        new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "normal",          new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "height",          new MFFloat ()),
			]),
			getTypeName: function ()
			{
				return "ElevationGrid";
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

		return ElevationGrid;
	}
});

