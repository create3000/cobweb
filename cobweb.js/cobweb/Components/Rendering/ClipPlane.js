
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Geometry/Plane3",
	"standard/Utility/ObjectCache",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DChildNode, 
          X3DConstants,
          Vector3,
          Plane3,
          ObjectCache)
{
"use strict";

	var
		vector     = new Vector3 (0, 0, 0),
		plane      = new Plane3 (vector, vector),
		ClipPlanes = ObjectCache (ClipPlaneContainer);

	function ClipPlaneContainer (clipPlane)
	{
		this .plane = new Plane3 (vector, vector);

		this .set (clipPlane);
	}

	ClipPlaneContainer .prototype =
	{
		constructor: ClipPlaneContainer,
		isClipped: function (point, invModelViewMatrix)
		{
			try
			{
				var distance = plane .assign (this .plane) .multRight (invModelViewMatrix) .getDistance (point);

				return distance < 0;
			}
			catch (error)
			{
				return false;
			}
		},
		set: function (clipPlane)
		{
			var
				plane  = this .plane,
				plane_ = clipPlane .plane_ .getValue ();

			plane .normal .assign (plane_);
			plane .distanceFromOrigin = -plane_ .w;

			plane .multRight (clipPlane .getBrowser () .getModelViewMatrix () .get ());
		},
		use: function (gl, shader, i)
		{
			var
				plane  = this .plane,
				normal = plane .normal;

			gl .uniform1i (shader .clipPlaneEnabled [i], true);
			gl .uniform4f (shader .clipPlaneVector [i], normal .x, normal .y, normal .z, plane .distanceFromOrigin);
		},
		recycle: function ()
		{
		   ClipPlanes .push (this);
		},
	};

	function ClipPlane (executionContext)
	{
		X3DChildNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .ClipPlane);
	}

	ClipPlane .prototype = $.extend (Object .create (X3DChildNode .prototype),
	{
		constructor: ClipPlane,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",  new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "plane",    new Fields .SFVec4f (0, 1, 0, 0)),
		]),
		getTypeName: function ()
		{
			return "ClipPlane";
		},
		getComponentName: function ()
		{
			return "Rendering";
		},
		getContainerField: function ()
		{
			return "children";
		},
		push: function ()
		{
			if (this .enabled_ .getValue ())
				this .getCurrentLayer () .getClipPlanes () .push (ClipPlanes .pop (this));
		},
		pop: function ()
		{
			if (this .enabled_ .getValue ())
				this .getBrowser () .getClipPlanes () .push (this .getCurrentLayer () .getClipPlanes () .pop ());
		},
	});

	return ClipPlane;
});


