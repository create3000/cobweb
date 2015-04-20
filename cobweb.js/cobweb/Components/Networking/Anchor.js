
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Grouping/X3DGroupingNode",
	"cobweb/Components/Networking/X3DUrlObject",
	"cobweb/Components/PointingDeviceSensor/TouchSensor",
	"cobweb/Bits/TraverseType",
	"cobweb/Bits/X3DConstants",
	"cobweb/InputOutput/Loader",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGroupingNode,
          X3DUrlObject,
          TouchSensor,
          TraverseType,
          X3DConstants,
          Loader)
{
	with (Fields)
	{
		function Anchor (executionContext)
		{
			X3DGroupingNode .call (this, executionContext .getBrowser (), executionContext);
			X3DUrlObject    .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Anchor);
		}

		Anchor .prototype = $.extend (Object .create (X3DGroupingNode .prototype),
			X3DUrlObject .prototype,
		{
			constructor: Anchor,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",       new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "description",    new SFString ("")),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "url",            new MFString ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "parameter",      new MFString ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",       new SFVec3f (-1, -1, -1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",     new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "addChildren",    new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "removeChildren", new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "children",       new MFNode ()),
			]),
			getTypeName: function ()
			{
				return "Anchor";
			},
			getComponentName: function ()
			{
				return "Networking";
			},
			getContainerField: function ()
			{
				return "children";
			},
			initialize: function ()
			{
				X3DGroupingNode .prototype .initialize .call (this);
				X3DUrlObject    .prototype .initialize .call (this);

				this .touchSensorNode = new TouchSensor (this .getExecutionContext ());

				this .touchSensorNode .touchTime_ .addInterest (this, "requestAsyncLoad");
				this .description_ .addFieldInterest (this .touchSensorNode .description_);

				this .touchSensorNode .description_ = this .description_;
				this .touchSensorNode .setup ();
			},
			requestAsyncLoad: function ()
			{
				this .setLoadState (X3DConstants .IN_PROGRESS_STATE, false);

				new Loader (this) .createX3DFromURL (this .url_, /*this .parameter_,*/
				function (scene)
				{
					if (scene)
					{
						this .getBrowser () .replaceWorld (scene);
						this .setLoadState (X3DConstants .COMPLETE_STATE, false);
					}
					else
						this .setLoadState (X3DConstants .FAILED_STATE, false);		
				}
				.bind (this),
				function (fragment)
				{
					this .getExecutionContext () .changeViewpoint (fragment);
					this .setLoadState (X3DConstants .COMPLETE_STATE, false);
				}
				.bind (this));
			},
			traverse: function (type)
			{
				if (type === TraverseType .POINTER)
				{
					this .getBrowser () .getSensors () .push ({ });
					this .touchSensorNode .push ();

					X3DGroupingNode .prototype .traverse .call (this, type);

					this .getBrowser () .getSensors () .pop ();
				}
				else
					X3DGroupingNode .prototype .traverse .call (this, type);
			},
		});

		return Anchor;
	}
});

