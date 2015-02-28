
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/PointingDeviceSensor/X3DTouchSensorNode",
	"cobweb/Components/Geospatial/X3DGeospatialObject",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DTouchSensorNode, 
          X3DGeospatialObject, 
          X3DConstants)
{
	with (Fields)
	{
		function GeoTouchSensor (executionContext)
		{
			X3DTouchSensorNode .call (this, executionContext .getBrowser (), executionContext);
			X3DGeospatialObject .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .GeoTouchSensor);
		}

		GeoTouchSensor .prototype = $.extend (new X3DTouchSensorNode (),new X3DGeospatialObject (),
		{
			constructor: GeoTouchSensor,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",            new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "enabled",             new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "geoSystem",           new MFString ([, "GD",, "WE", ])),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "description",         new SFString ("")),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "hitTexCoord_changed", new SFVec2f ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "hitNormal_changed",   new SFVec3f ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "hitPoint_changed",    new SFVec3f ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "hitGeoCoord_changed", new SFVec3d ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "isOver",              new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",            new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "touchTime",           new SFTime ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "geoOrigin",           new SFNode ()),
			]),
			getTypeName: function ()
			{
				return "GeoTouchSensor";
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

		return GeoTouchSensor;
	}
});

