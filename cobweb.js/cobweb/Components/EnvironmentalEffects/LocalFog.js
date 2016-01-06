
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Components/EnvironmentalEffects/X3DFogObject",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DChildNode, 
          X3DFogObject, 
          X3DConstants)
{
"use strict";

	function LocalFog (executionContext)
	{
		X3DChildNode .call (this, executionContext);
		X3DFogObject .call (this, executionContext);

		this .addType (X3DConstants .LocalFog);
	}

	LocalFog .prototype = $.extend (Object .create (X3DChildNode .prototype),
		X3DFogObject .prototype,
	{
		constructor: LocalFog,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",        new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",         new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "fogType",         new Fields .SFString ("LINEAR")),
			new X3DFieldDefinition (X3DConstants .inputOutput, "color",           new Fields .SFColor (1, 1, 1)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "visibilityRange", new Fields .SFFloat ()),
		]),
		getTypeName: function ()
		{
			return "LocalFog";
		},
		getComponentName: function ()
		{
			return "EnvironmentalEffects";
		},
		getContainerField: function ()
		{
			return "children";
		},
		initialize: function ()
		{
			X3DChildNode .prototype .initialize .call (this);
			X3DFogObject .prototype .initialize .call (this);
		},
		push: function ()
		{
			if (this .enabled_ .getValue ())
				this .getCurrentLayer () .pushLocalFog (this);
		},
		pop: function ()
		{
			if (this .enabled_ .getValue ())
				this .getCurrentLayer () .popLocalFog ();
		},
	});

	return LocalFog;
});


