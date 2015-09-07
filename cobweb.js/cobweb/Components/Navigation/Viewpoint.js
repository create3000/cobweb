
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Navigation/X3DViewpointNode",
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
          X3DConstants,
          Camera,
          Vector3,
          Matrix4)
{
	with (Fields)
	{
		function Viewpoint (executionContext)
		{
			X3DViewpointNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Viewpoint);

			this .projectionMatrix = new Matrix4 ();
		}

		Viewpoint .prototype = $.extend (Object .create (X3DViewpointNode .prototype),
		{
			constructor: Viewpoint,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",          new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,   "set_bind",          new SFBool ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "description",       new SFString ("")),
				new X3DFieldDefinition (X3DConstants .inputOutput, "position",          new SFVec3f (0, 0, 10)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "orientation",       new SFRotation (0, 0, 1, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "centerOfRotation",  new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "fieldOfView",       new SFFloat (Math .PI / 4)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "jump",              new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "retainUserOffsets", new SFBool (false)),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "isBound",           new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "bindTime",          new SFTime ()),
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
			getProjectionMatrix: function (zNear, zFar, viewport)
			{
				return Camera .perspective (this .getFieldOfView (), zNear, zFar, viewport, this .projectionMatrix);
			},
		});

		return Viewpoint;
	}
});

