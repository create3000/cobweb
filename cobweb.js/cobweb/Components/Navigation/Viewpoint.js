
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Navigation/X3DViewpointNode",
	"cobweb/Components/Interpolation/ScalarInterpolator",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Geometry/Camera",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Matrix4",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DViewpointNode,
          ScalarInterpolator,
          X3DConstants,
          Camera,
          Vector3,
          Matrix4)
{
"use strict";

	function Viewpoint (executionContext)
	{
		X3DViewpointNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .Viewpoint);

		this .projectionMatrix = new Matrix4 ();

		this .fieldOfViewInterpolator = new ScalarInterpolator (this .getBrowser () .getPrivateScene ());
		this .fieldOfViewInterpolator .setName ("Default");
	}

	Viewpoint .prototype = $.extend (Object .create (X3DViewpointNode .prototype),
	{
		constructor: Viewpoint,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",          new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,   "set_bind",          new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "description",       new Fields .SFString ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "position",          new Fields .SFVec3f (0, 0, 10)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "orientation",       new Fields .SFRotation ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "centerOfRotation",  new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "fieldOfView",       new Fields .SFFloat (Math .PI / 4)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "jump",              new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "retainUserOffsets", new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "isBound",           new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "bindTime",          new Fields .SFTime ()),
		]),
		getTypeName: function ()
		{
			return "Viewpoint";
		},
		getComponentName: function ()
		{
			return "Navigation";
		},
		getContainerField: function ()
		{
			return "children";
		},
		initialize: function ()
		{
			X3DViewpointNode .prototype .initialize .call (this);

			this .fieldOfViewInterpolator .key_ = [ 0, 1 ];
			this .fieldOfViewInterpolator .setup ();

			this .getEaseInEaseOut () .modifiedFraction_changed_ .addFieldInterest (this .fieldOfViewInterpolator .set_fraction_);
			this .fieldOfViewInterpolator .value_changed_ .addFieldInterest (this .fieldOfViewScale_);
		},
		setInterpolators: function (fromViewpoint)
		{
			if (fromViewpoint .getType () .indexOf (X3DConstants .Viewpoint) < 0)
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
		getFieldOfView: function ()
		{
			var fov = this .fieldOfView_ * this .fieldOfViewScale_;

			return fov > 0 && fov < Math .PI ? fov : Math .PI / 4;
		},
		getScreenScale: function (distance, viewport)
		{
			var
				width  = viewport [2],
				height = viewport [3],
				size   = distance * Math .tan (this .getFieldOfView () / 2) * 2;

			if (width > height)
				size /= height;

			else
				size /= width;

			return new Vector3 (size, size, size);
		},
		getLookAtDistance: function (bbox)
		{
			return (bbox .size .abs () / 2) / Math .tan (this .getFieldOfView () / 2);
		},
		getProjectionMatrix: function (zNear, zFar, viewport)
		{
			return Camera .perspective (this .getFieldOfView (), zNear, zFar, viewport, this .projectionMatrix);
		},
	});

	return Viewpoint;
});


