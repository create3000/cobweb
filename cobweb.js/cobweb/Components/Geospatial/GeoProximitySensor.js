
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/EnvironmentalSensor/X3DEnvironmentalSensorNode",
	"cobweb/Components/Geospatial/X3DGeospatialObject",
	"cobweb/Components/EnvironmentalSensor/ProximitySensor",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DEnvironmentalSensorNode, 
          X3DGeospatialObject,
          ProximitySensor,
          X3DConstants,
          Vector3)
{
"use strict";

	var geoCoord = new Vector3 (0, 0, 0);

	function GeoProximitySensor (executionContext)
	{
		X3DEnvironmentalSensorNode .call (this, executionContext);
		X3DGeospatialObject        .call (this, executionContext);

		this .addType (X3DConstants .GeoProximitySensor);

		this .proximitySensor = new ProximitySensor (executionContext);

		this .setCameraObject (this .proximitySensor .getCameraObject ());
	}

	GeoProximitySensor .prototype = $.extend (Object .create (X3DEnvironmentalSensorNode .prototype),
		X3DGeospatialObject .prototype,
	{
		constructor: GeoProximitySensor,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",                 new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "geoOrigin",                new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "geoSystem",                new Fields .MFString ("GD", "WE")),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "enabled",                  new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "size",                     new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "center",                   new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",                 new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "enterTime",                new Fields .SFTime ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "exitTime",                 new Fields .SFTime ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "geoCoord_changed",         new Fields .SFVec3d ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "position_changed",         new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "orientation_changed",      new Fields .SFRotation ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "centerOfRotation_changed", new Fields .SFVec3f ()),
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
		initialize: function ()
		{
			X3DEnvironmentalSensorNode .prototype .initialize .call (this);
			X3DGeospatialObject        .prototype .initialize .call (this);

			this .enabled_ .addFieldInterest (this .proximitySensor .enabled_);
			this .size_    .addFieldInterest (this .proximitySensor .size_);
			this .center_  .addFieldInterest (this .proximitySensor .center_);
		
			this .proximitySensor .isCameraObject_ .addFieldInterest (this .isCameraObject_);
		
			this .proximitySensor .isActive_                 .addFieldInterest (this .isActive_);
			this .proximitySensor .enterTime_                .addFieldInterest (this .enterTime_);
			this .proximitySensor .exitTime_                 .addFieldInterest (this .exitTime_);
			this .proximitySensor .position_changed_         .addFieldInterest (this .position_changed_);
			this .proximitySensor .orientation_changed_      .addFieldInterest (this .orientation_changed_);
			this .proximitySensor .centerOfRotation_changed_ .addFieldInterest (this .centerOfRotation_changed_);
		
			this .proximitySensor .position_changed_ .addInterest (this, "set_position__");
		
			this .proximitySensor .enabled_ = this .enabled_;
			this .proximitySensor .size_    = this .size_;
			this .proximitySensor .center_  = this .center_;
		
			this .proximitySensor .setup ();
		},
		set_position__: function (position)
		{
			this .geoCoord_changed_ = this .getGeoCoord (this .proximitySensor .position_changed_ .getValue (), geoCoord);
		},
		traverse: function (type)
		{
			this .proximitySensor .traverse (type);
		},
	});

	return GeoProximitySensor;
});


