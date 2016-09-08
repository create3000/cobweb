
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Browser/Shaders/Shader",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Components/Networking/X3DUrlObject",
	"cobweb/InputOutput/Loader",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          Shader,
          X3DNode, 
          X3DUrlObject,
          Loader,
          X3DConstants)
{
"use strict";

	var shaderTypes =
	{
		VERTEX:          "VERTEX_SHADER",
		TESS_CONTROL:    "TESS_CONTROL_SHADER",
		TESS_EVALUATION: "TESS_EVALUATION_SHADER",
		GEOMETRY:        "GEOMETRY_SHADER",
		FRAGMENT:        "FRAGMENT_SHADER",
		COMPUTE:         "COMPUTE_SHADER",
	};

	function ShaderPart (executionContext)
	{
		X3DNode      .call (this, executionContext);
		X3DUrlObject .call (this, executionContext);

		this .valid = false;

		this .addType (X3DConstants .ShaderPart);
	}

	ShaderPart .prototype = $.extend (Object .create (X3DNode .prototype),
		X3DUrlObject .prototype,
	{
		constructor: ShaderPart,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "type",     new Fields .SFString ("VERTEX")),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "url",      new Fields .MFString ()),
		]),
		getTypeName: function ()
		{
			return "ShaderPart";
		},
		getComponentName: function ()
		{
			return "Shaders";
		},
		getContainerField: function ()
		{
			return "parts";
		},
		initialize: function ()
		{
			X3DNode      .prototype .initialize .call (this);
			X3DUrlObject .prototype .initialize .call (this);

			var gl = this .getBrowser () .getContext ();

			this .shader = gl .createShader (gl [this .getShaderType ()]);

			this .requestAsyncLoad ();
		},
		isValid: function ()
		{
			return this .valid;
		},
		getShader: function ()
		{
			return this .shader;
		},
		getShaderType: function ()
		{
			var type = shaderTypes [this .type_ .getValue ()];
			
			if (type)
				return type;

			return "VERTEX_SHADER";
		},
		getCDATA: function ()
		{
			return this .url_;
		},
		requestAsyncLoad: function ()
		{
			if (this .checkLoadState () == X3DConstants .COMPLETE_STATE || this .checkLoadState () == X3DConstants .IN_PROGRESS_STATE)
				return;
	
			this .setLoadState (X3DConstants .IN_PROGRESS_STATE);
			
			this .valid = false;

			new Loader (this) .loadDocument (this .url_,
			function (data, URL)
			{
				if (data === null)
				{
					// No URL could be loaded.
					this .setLoadState (X3DConstants .FAILED_STATE);
				}
				else
				{
					var gl = this .getBrowser () .getContext ();

					gl .shaderSource (this .shader, Shader .getShaderSource (data));
					gl .compileShader (this .shader);
	
					this .valid = gl .getShaderParameter (this .shader, gl .COMPILE_STATUS);
	
					if (! this .valid)
						throw new Error (this .getTypeName () + " '" + this .getName () + "': " + gl .getShaderInfoLog (this .shader));

					this .setLoadState (X3DConstants .COMPLETE_STATE);
				}
			}
			.bind (this));

		},
	});

	return ShaderPart;
});

