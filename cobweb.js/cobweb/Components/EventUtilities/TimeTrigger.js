
define ("cobweb/Components/EventUtilities/TimeTrigger",
[
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/EventUtilities/X3DTriggerNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DTriggerNode, 
          X3DConstants)
{
"use strict";

	function TimeTrigger (executionContext)
	{
		X3DTriggerNode .call (this, executionContext);

		this .addType (X3DConstants .TimeTrigger);
	}

	TimeTrigger .prototype = $.extend (Object .create (X3DTriggerNode .prototype),
	{
		constructor: TimeTrigger,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",    new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,   "set_boolean", new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "triggerTime", new Fields .SFTime ()),
		]),
		getTypeName: function ()
		{
			return "TimeTrigger";
		},
		getComponentName: function ()
		{
			return "EventUtilities";
		},
		getContainerField: function ()
		{
			return "children";
		},
		initialize: function ()
		{
			X3DTriggerNode .prototype .initialize .call (this);
		
			this .set_boolean_ .addInterest (this, "set_boolean__");
		},
		set_boolean__: function ()
		{
			this .triggerTime_ = this .getBrowser () .getCurrentTime ();
		},
	});

	return TimeTrigger;
});


