
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Interpolation/X3DInterpolatorNode",
	"cobweb/Components/Geospatial/X3DGeospatialObject",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DInterpolatorNode, 
          X3DGeospatialObject, 
          X3DConstants)
{
	with (Fields)
	{
		function GeoPositionInterpolator (executionContext)
		{
			X3DInterpolatorNode .call (this, executionContext .getBrowser (), executionContext);
			X3DGeospatialObject .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .GeoPositionInterpolator);
		}

		GeoPositionInterpolator .prototype = $.extend (new X3DInterpolatorNode (),new X3DGeospatialObject (),
		{
			constructor: GeoPositionInterpolator,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",         new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "geoSystem",        new MFString ([, "GD",, "WE", ])),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "set_fraction",     new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "key",              new MFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "keyValue",         new MFVec3d ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "value_changed",    new SFVec3d ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "geovalue_changed", new SFVec3d ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "geoOrigin",        new SFNode ()),
			]),
			getTypeName: function ()
			{
				return "GeoPositionInterpolator";
			},
			getComponentName: function ()
			{
				return "Geospatial";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return GeoPositionInterpolator;
	}
});

