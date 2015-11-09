
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Components/Networking/X3DUrlObject",
	"cobweb/Components/Shaders/X3DProgrammableShaderObject",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DNode, 
          X3DUrlObject, 
          X3DProgrammableShaderObject, 
          X3DConstants)
{
"use strict";

	function ShaderProgram (executionContext)
	{
		X3DNode .call (this, executionContext .getBrowser (), executionContext);
		X3DUrlObject .call (this, executionContext .getBrowser (), executionContext);
		X3DProgrammableShaderObject .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .ShaderProgram);
	}

	ShaderProgram .prototype = $.extend (Object .create (X3DNode .prototype),new X3DUrlObject (),new X3DProgrammableShaderObject (),
	{
		constructor: ShaderProgram,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "type",     new Fields .SFString ("VERTEX")),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "url",      new Fields .MFString ()),
		]),
		getTypeName: function ()
		{
			return "ShaderProgram";
		},
		getComponentName: function ()
		{
			return "Shaders";
		},
		getContainerField: function ()
		{
			return "programs";
		},
		getCDATA: function ()
		{
			return this .url_;
		},
	});

	return ShaderProgram;
});


