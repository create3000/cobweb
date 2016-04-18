
define ("cobweb/Components/EnvironmentalSensor/TransformSensor",
[
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/EnvironmentalSensor/X3DEnvironmentalSensorNode",
	"cobweb/Bits/X3DConstants",
	"cobweb/Bits/X3DCast",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Rotation4",
	"standard/Math/Geometry/Box3",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DEnvironmentalSensorNode, 
          X3DConstants,
          X3DCast,
          Vector3,
          Rotation4,
          Box3)
{
"use strict";

	var
		position    = new Vector3 (0, 0, 0),
		orientation = new Rotation4 (0, 0, 1, 0),
		infinity    = new Vector3 (-1, -1, -1);
	
	function TransformSensor (executionContext)
	{
		X3DEnvironmentalSensorNode .call (this, executionContext);

		this .addType (X3DConstants .TransformSensor);

		this .targetObjectNode = null;
	}

	TransformSensor .prototype = $.extend (Object .create (X3DEnvironmentalSensorNode .prototype),
	{
		constructor: TransformSensor,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",            new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",             new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "size",                new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "center",              new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "enterTime",           new Fields .SFTime ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "exitTime",            new Fields .SFTime ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "isActive",            new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "position_changed",    new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "orientation_changed", new Fields .SFRotation ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "targetObject",        new Fields .SFNode ()),
		]),
		getTypeName: function ()
		{
			return "TransformSensor";
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
		
			this .getExecutionContext () .isLive () .addInterest (this, "set_enabled__");
			this .isLive () .addInterest (this, "set_enabled__");

			this .enabled_      .addInterest (this, "set_enabled__");
			this .size_         .addInterest (this, "set_enabled__");
			this .targetObject_ .addInterest (this, "set_targetObject__");

			this .set_targetObject__ ();
		},
		set_live__: function ()
		{ },
		set_enabled__: function ()
		{
			if (this .targetObjectNode && this .enabled_ .getValue () && this .isLive () .getValue () && this .getExecutionContext () .isLive () .getValue () && ! this .size_. getValue () .equals (Vector3 .Zero))
			{
				this .getBrowser () .sensors () .addInterest (this, "update");
			}
			else
			{
				this .getBrowser () .sensors () .removeInterest (this, "update");
					
				if (this .isActive_ .getValue ())
				{
					this .isActive_ = false;
					this .exitTime_ = this .getBrowser () .getCurrentTime ();
				}
			}
		},
		set_targetObject__: function ()
		{
			this .targetObjectNode = X3DCast (X3DConstants .X3DBoundedObject, this .targetObject_);
		
			this .set_enabled__ ();
		},
		update: function ()
		{
			var sourceBox = new Box3 (this .size_ .getValue (), this .center_ .getValue ());
			var targetBox = this .targetObjectNode .getBBox ();
		
			if (this .size_. getValue () .equals (infinity) || sourceBox .intersectsBox (targetBox))
			{
				targetBox .getMatrix () .get (position, orientation);
		
				if (this .isActive_ .getValue ())
				{
					if (! this .position_changed_ .getValue () .equals (position))
						this .position_changed_ = position;
	
					if (! this .orientation_changed_ .getValue () .equals (orientation))
						this .orientation_changed_ = orientation;
				}
				else
				{
					this .isActive_  = true;
					this .enterTime_ = this .getBrowser () .getCurrentTime ();

					this .position_changed_         = position;
					this .orientation_changed_      = orientation;
				}
			}
			else
			{
				if (this .isActive_ .getValue ())
				{
					this .isActive_ = false;
					this .exitTime_ = this .getBrowser () .getCurrentTime ();
				}
			}
		},
	});

	return TransformSensor;
});


