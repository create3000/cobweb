
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/EnvironmentalSensor/X3DEnvironmentalSensorNode",
	"cobweb/Bits/TraverseType",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Matrix4",
	"standard/Math/Geometry/Box3",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DEnvironmentalSensorNode,
          TraverseType,
          X3DConstants,
          Vector3,
          Matrix4,
          Box3)
{
"use strict";

	var infinity = new Vector3 (-1, -1, -1);
	
	function VisibilitySensor (executionContext)
	{
		X3DEnvironmentalSensorNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .VisibilitySensor);

		this .visible = false;
	}

	VisibilitySensor .prototype = $.extend (Object .create (X3DEnvironmentalSensorNode .prototype),
	{
		constructor: VisibilitySensor,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",  new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",   new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "size",      new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "center",    new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "enterTime", new Fields .SFTime ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "exitTime",  new Fields .SFTime ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "isActive",  new Fields .SFBool ()),
		]),
		size: new Vector3 (0, 0, 0),
		center: new Vector3 (0, 0, 0),
		modelViewMatrix: new Matrix4 (),
		getTypeName: function ()
		{
			return "VisibilitySensor";
		},
		getComponentName: function ()
		{
			return "EnvironmentalSensor";
		},
		getContainerField: function ()
		{
			return "children";
		},
		initialize: function ()
		{
			X3DEnvironmentalSensorNode .prototype .initialize .call (this);

			this .enabled_ .addInterest (this, "set_enabled___");

			this .set_enabled___ ();
		},
		set_enabled___: function ()
		{
			this .setCameraObject (this .enabled_ .getValue ());
			
			if (this .enabled_ .getValue ())
				this .traverse = traverse;
			else
				delete this .traverse;
		},
		update: function ()
		{
			if (this .visible && this .getTraversed ())
			{
				if (! this .isActive_ .getValue ())
				{
					this .isActive_  = true;
					this .enterTime_ = this .getBrowser () .getCurrentTime ();
				}

				this .visible = false;
			}
			else
			{
				if (this .isActive_ .getValue ())
				{
					this .isActive_ = false;
					this .exitTime_ = this .getBrowser () .getCurrentTime ();
				}
			}
				
			this .setTraversed (false);
		},
		traverse: function () { },
	});
		
	function traverse (type)
	{
	   switch (type)
	   {
			case TraverseType .CAMERA:
			{
				if (this .visible)
					return;

				if (this .size_ .getValue () .equals (infinity))
					this .visible = true;

				else
				{
					var
						viewVolume      = this .getCurrentLayer () .getViewVolume (),
						modelViewMatrix = this .getModelViewMatrix (type, this .modelViewMatrix),
						size            = modelViewMatrix .multDirMatrix (this .size .assign (this .size_ .getValue ())),
						center          = modelViewMatrix .multVecMatrix (this .center .assign (this .center_ .getValue ()));

					this .visible = viewVolume .intersectsSphere (size .abs () / 2, center);
				}

				return;
			}
			case TraverseType .DISPLAY:
			{
				this .setTraversed (true);
				return;
			}
		}
	}

	return VisibilitySensor;
});


