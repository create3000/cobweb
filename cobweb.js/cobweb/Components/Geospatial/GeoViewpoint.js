
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Navigation/X3DViewpointNode",
	"cobweb/Components/Geospatial/X3DGeospatialObject",
	"cobweb/Components/Interpolation/ScalarInterpolator",
	"cobweb/Components/Navigation/NavigationInfo",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Geometry/Camera",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Rotation4",
	"standard/Math/Numbers/Matrix4",
	"standard/Math/Algorithm",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DViewpointNode, 
          X3DGeospatialObject,
          ScalarInterpolator,
          NavigationInfo,
          X3DConstants,
          Camera,
          Vector3,
          Rotation4,
          Matrix4,
          Algorithm)
{
"use strict";

	var
		zAxis               = new Vector3 (0, 0, 1),
		screenScale         = new Vector3 (0, 0, 0),
		normalized          = new Vector3 (0, 0, 0),
		upVector            = new Vector3 (0, 0, 0),
		locationMatrix      = new Matrix4 (),
		position            = new Vector3 (0, 0, 0),
		orientation         = new Rotation4 (0, 0, 1, 0),
		centerOfRotation    = new Vector3 (0, 0, 0),
		geoPosition         = new Vector3 (0, 0, 0),
		geoOrientation      = new Rotation4 (0, 0, 1, 0),
		geoCenterOfRotation = new Vector3 (0, 0, 0);

	function traverse (type)
	{
		X3DViewpointNode .prototype .traverse .call (this .type);

		this .navigationInfoNode .traverse (type);
	}

	function GeoViewpoint (executionContext)
	{
		X3DViewpointNode    .call (this, executionContext);
		X3DGeospatialObject .call (this, executionContext);

		this .addType (X3DConstants .GeoViewpoint);

		this .navigationInfoNode      = new NavigationInfo (executionContext);
		this .fieldOfViewInterpolator = new ScalarInterpolator (this .getBrowser () .getPrivateScene ());
		this .projectionMatrix        = new Matrix4 ();
		this .position                = new Vector3 ();
		this .elevation               = 0;

		switch (executionContext .specificationVersion)
		{
			case "2.0":
			case "3.0":
			case "3.1":
			case "3.2":
				this .traverse = traverse;
				break;
		}
	}

	GeoViewpoint .prototype = $.extend (Object .create (X3DViewpointNode .prototype),
		X3DGeospatialObject .prototype,
	{
		constructor: GeoViewpoint,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",          new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "geoOrigin",         new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "geoSystem",         new Fields .MFString ("GD", "WE")),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "set_bind",          new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "description",       new Fields .SFString ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "position",          new Fields .SFVec3d (0, 0, 100000)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "orientation",       new Fields .SFRotation ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "centerOfRotation",  new Fields .SFVec3d ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "fieldOfView",       new Fields .SFFloat (0.785398)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "jump",              new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "retainUserOffsets", new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "navType",           new Fields .MFString ("EXAMINE", "ANY")),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "headlight",         new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "speedFactor",       new Fields .SFFloat (1)),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "isBound",           new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "bindTime",          new Fields .SFTime ()),
		]),
		getTypeName: function ()
		{
			return "GeoViewpoint";
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
			X3DViewpointNode    .prototype .initialize .call (this);
			X3DGeospatialObject .prototype .initialize .call (this);

			this .position_       .addInterest (this, "set_position__");
			this .positionOffset_ .addInterest (this, "set_position__");
			this .navType_        .addFieldInterest (this .navigationInfoNode .type_);
			this .headlight_      .addFieldInterest (this .navigationInfoNode .headlight_);
		
			this .navigationInfoNode .setup ();
		
			this .set_position__ ();

			// Setup interpolators

			this .fieldOfViewInterpolator .key_ = [ 0, 1 ];
			this .fieldOfViewInterpolator .setup ();

			this .getEaseInEaseOut () .modifiedFraction_changed_ .addFieldInterest (this .fieldOfViewInterpolator .set_fraction_);
			this .fieldOfViewInterpolator .value_changed_ .addFieldInterest (this .fieldOfViewScale_);
		},
		setInterpolators: function (fromViewpoint)
		{
			if (fromViewpoint .getType () .indexOf (X3DConstants .GeoViewpoint) < 0)
			{
				this .fieldOfViewInterpolator .keyValue_ = [ this .fieldOfViewScale_ .getValue (), this .fieldOfViewScale_ .getValue () ];
			}
			else
			{
				var scale = fromViewpoint .getFieldOfView () / this .fieldOfView_ .getValue ();
	
				this .fieldOfViewInterpolator .keyValue_ = [ scale, this .fieldOfViewScale_ .getValue () ];
	
				this .fieldOfViewScale_ = scale;
			}
		},
		setPosition: function (value)
		{
			this .position_ .setValue (this .getGeoCoord (value, geoPosition));
		},
		getPosition: function () 
		{
			return this .getCoord (this .position_ .getValue (), position);
		},
		set_position__: function ()
		{
			this .getCoord (this .position_ .getValue (), this .position);

			this .elevation = this .getGeoElevation (position .assign (this .position) .add (this .positionOffset_ .getValue ()));
		},
		setOrientation: function (value)
		{
			///  Returns the resulting orientation for this viewpoint.

			var rotationMatrix = this .getLocationMatrix (this .position_ .getValue (), locationMatrix) .submatrix;

			geoOrientation .setMatrix (rotationMatrix);

			this .orientation_ .setValue (geoOrientation .inverse () .multLeft (value));
		},
		getOrientation: function ()
		{
			///  Returns the resulting orientation for this viewpoint.

			var rotationMatrix = this .getLocationMatrix (this .position_ .getValue (), locationMatrix) .submatrix;

			orientation .setMatrix (rotationMatrix);
		
			return orientation .multLeft (this .orientation_ .getValue ());
		},
		getCenterOfRotation: function ()
		{
			return this .getCoord (this .centerOfRotation_ .getValue (), centerOfRotation);
		},
		getFieldOfView: function ()
		{
			var fov = this .fieldOfView_ * this .fieldOfViewScale_;

			return fov > 0 && fov < Math .PI ? fov : Math .PI / 4;
		},
		getUpVector: function ()
		{
			return this .getGeoUpVector .call (this, position .assign (this .position) .add (this .positionOffset_ .getValue ()), upVector);
		},
		getSpeedFactor: function ()
		{
			return (Math .max (this .elevation, 0.0) + 10) / 10 * this .speedFactor_ .getValue ();
		},
		getMaxZFar: function ()
		{
			return 1e9;
		},
		getScreenScale: function (point, viewport)
		{
		   // Returns the screen scale in meter/pixel for on pixel.

			var
				width  = viewport [2],
				height = viewport [3],
				size   = Math .tan (this .getFieldOfView () / 2) * 2 * point .abs (); // Assume we are on sphere.

			size *= Math .abs (normalized .assign (point) .normalize () .dot (zAxis));

			if (width > height)
				size /= height;
			else
				size /= width;

			return screenScale .set (size, size, size);
		},
		getLookAtDistance: function (bbox)
		{
			return (bbox .size .abs () / 2) / Math .tan (this .getFieldOfView () / 2);
		},
		getProjectionMatrix: function (zNear, zFar, viewport)
		{
			// Linear interpolate zNear and zFar
			var
				geoZNear = Math .max (Algorithm .lerp (Math .min (zNear, 1e4), 1e4, this .elevation / 1e7), 0.1),
				geoZFar  = Math .max (Algorithm .lerp (1e6, Math .max (zFar, 1e6),  this .elevation / 1e7), 1e6);

			return Camera .perspective (this .getFieldOfView (), geoZNear, geoZFar, viewport, this .projectionMatrix);
		},
	});

	return GeoViewpoint;
});


