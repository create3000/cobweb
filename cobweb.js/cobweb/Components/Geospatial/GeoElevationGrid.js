
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DGeometryNode",
	"cobweb/Components/Geospatial/X3DGeospatialObject",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGeometryNode, 
          X3DGeospatialObject, 
          X3DConstants)
{
	with (Fields)
	{
		function GeoElevationGrid (executionContext)
		{
			X3DGeometryNode .call (this, executionContext .getBrowser (), executionContext);
			X3DGeospatialObject .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .GeoElevationGrid);
		}

		GeoElevationGrid .prototype = $.extend (Object .create (X3DGeometryNode .prototype),new X3DGeospatialObject (),
		{
			constructor: GeoElevationGrid,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",        new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "geoSystem",       new MFString ([ "GD", "WE" ])),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "geoGridOrigin",   new SFVec3d ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "xDimension",      new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "zDimension",      new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "xSpacing",        new SFDouble (1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "zSpacing",        new SFDouble (1)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "yScale",          new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",           new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "ccw",             new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "creaseAngle",     new SFDouble ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "colorPerVertex",  new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "normalPerVertex", new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "color",           new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "texCoord",        new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "normal",          new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "height",          new MFDouble ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "geoOrigin",       new SFNode ()),
			]),
			getTypeName: function ()
			{
				return "GeoElevationGrid";
			},
			getComponentName: function ()
			{
				return "Geospatial";
			},
			getContainerField: function ()
			{
				return "geometry";
			},
		});

		return GeoElevationGrid;
	}
});

