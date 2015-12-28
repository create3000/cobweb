
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Navigation/X3DViewpointNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Geometry/Camera",
	"standard/Math/Numbers/Vector2",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Matrix4",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DViewpointNode, 
          X3DConstants,
          Camera,
          Vector2,
          Vector3,
          Matrix4)
{
"use strict";

	var
		screenScale  = new Vector3 (0, 0, 0),
		viewportSize = new Vector2 (0, 0);

	function OrthoViewpoint (executionContext)
	{
		X3DViewpointNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .OrthoViewpoint);

		this .projectionMatrix = new Matrix4 ();
	}

	OrthoViewpoint .prototype = $.extend (Object .create (X3DViewpointNode .prototype),
	{
		constructor: OrthoViewpoint,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",          new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,   "set_bind",          new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "description",       new Fields .SFString ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "position",          new Fields .SFVec3f (0, 0, 10)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "orientation",       new Fields .SFRotation ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "centerOfRotation",  new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "fieldOfView",       new Fields .MFFloat ([ -1, -1, 1, 1 ])),
			new X3DFieldDefinition (X3DConstants .inputOutput, "jump",              new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "retainUserOffsets", new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "isBound",           new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "bindTime",          new Fields .SFTime ()),
		]),
		getTypeName: function ()
		{
			return "OrthoViewpoint";
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

			this .fieldOfView_      .addInterest (this, "set_fieldOfView___");
			this .fieldOfViewScale_ .addInterest (this, "set_fieldOfView___");

			this .set_fieldOfView___ ();
		},
		set_fieldOfView___: function ()
		{
			var
				length           = this .fieldOfView_ .length,
				fieldOfViewScale = this .fieldOfViewScale_ .getValue ();

			this .minimumX = (length > 0 ? this .fieldOfView_ [0] : -1) * fieldOfViewScale;
			this .minimumY = (length > 1 ? this .fieldOfView_ [1] : -1) * fieldOfViewScale;
			this .maximumX = (length > 2 ? this .fieldOfView_ [2] :  1) * fieldOfViewScale;
			this .maximumY = (length > 3 ? this .fieldOfView_ [3] :  1) * fieldOfViewScale;

			this .sizeX = this .maximumX - this .minimumX;
			this .sizeY = this .maximumY - this .minimumY;
		},
		getMinimumX: function ()
		{
			return this .minimumX;
		},
		getMinimumY: function ()
		{
			return this .minimumY;
		},
		getMaximumX: function ()
		{
			return this .maximumX;
		},
		getMaximumY: function ()
		{
			return this .maximumY;
		},
		getSizeX: function ()
		{
			return this .sizeX;
		},
		getSizeY: function ()
		{
			return this .sizeY;
		},
		getScreenScale: function (distance, viewport)
		{
			var
				width  = viewport [2],
				height = viewport [3],
				sizeX  = this .sizeX,
				sizeY  = this .sizeY,
				aspect = width / height;

			if (aspect > sizeX / sizeY)
			{
				var s = sizeY / height;

				return screenScale .set (s, s, s);
			}

			var s = sizeX / width;

			return screenScale .set (s, s, s);
		},
		getViewportSize: function (viewport)
		{
			var
				width  = viewport [2],
				height = viewport [3],
				sizeX  = this .sizeX,
				sizeY  = this .sizeY,
				aspect = width / height;

			if (aspect > sizeX / sizeY)
				return viewportSize .set (sizeY * aspect, sizeY);

			return viewportSize .set (sizeX, sizeX / aspect);
		},
		getLookAtDistance: function (bbox)
		{
			return bbox .size .abs () / 2 + 10;
		},
		getProjectionMatrix: function (zNear, zFar, viewport)
		{
			var
				width  = viewport [2],
				height = viewport [3],
				aspect = width / height,
				sizeX  = this .sizeX,
				sizeY  = this .sizeY;

			if (aspect > sizeX / sizeY)
			{
				var
					center  = (this .minimumX + this .maximumX) / 2,
					size1_2 = (sizeY * aspect) / 2;

				return Camera .ortho (center - size1_2, center + size1_2, this .minimumY, this .maximumY, zNear, zFar, this .projectionMatrix);
			}

			var
				center  = (this .minimumY + this .maximumY) / 2,
				size1_2 = (sizeX / aspect) / 2;

			return Camera .ortho (this .minimumX, this .maximumX, center - size1_2, center + size1_2, zNear, zFar, this .projectionMatrix);
		},
	});

	return OrthoViewpoint;
});


