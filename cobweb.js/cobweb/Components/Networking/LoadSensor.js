
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Networking/X3DNetworkSensorNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DNetworkSensorNode, 
          X3DConstants)
{
"use strict";

	function LoadSensor (executionContext)
	{
		X3DNetworkSensorNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .LoadSensor);
	}

	LoadSensor .prototype = $.extend (Object .create (X3DNetworkSensorNode .prototype),
	{
		constructor: LoadSensor,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",  new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",   new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "timeOut",   new Fields .SFTime ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "isActive",  new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "isLoaded",  new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "progress",  new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "loadTime",  new Fields .SFTime ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "watchList", new Fields .MFNode ()),
		]),
		getTypeName: function ()
		{
			return "LoadSensor";
		},
		getComponentName: function ()
		{
			return "Networking";
		},
		getContainerField: function ()
		{
			return "children";
		},
	});

	return LoadSensor;
});


