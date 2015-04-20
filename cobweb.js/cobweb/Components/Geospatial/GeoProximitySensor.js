
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/EnvironmentalSensor/X3DEnvironmentalSensorNode",
	"cobweb/Components/Geospatial/X3DGeospatialObject",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DEnvironmentalSensorNode, 
          X3DGeospatialObject, 
          X3DConstants)
{
	with (Fields)
	{
		function GeoProximitySensor (executionContext)
		{
			X3DEnvironmentalSensorNode .call (this, executionContext .getBrowser (), executionContext);
			X3DGeospatialObject .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .GeoProximitySensor);
		}

		GeoProximitySensor .prototype = $.extend (Object .create (X3DEnvironmentalSensorNode .prototype),new X3DGeospatialObject (),
		{
			constructor: GeoProximitySensor,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",                 new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "enabled",                  new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "geoSystem",                new MFString ([, "GD",, "WE", ])),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "size",                     new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "center",                   new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",                 new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "enterTime",                new SFTime ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "exitTime",                 new SFTime ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "geoCoord_changed",         new SFVec3d ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "position_changed",         new SFVec3f ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "orientation_changed",      new SFRotation ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "centerOfRotation_changed", new SFVec3f ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "geoOrigin",                new SFNode ()),
			]),
			getTypeName: function ()
			{
				return "GeoProximitySensor";
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

		return GeoProximitySensor;
	}
});

