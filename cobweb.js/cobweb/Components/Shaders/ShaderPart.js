
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Components/Networking/X3DUrlObject",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DNode, 
          X3DUrlObject, 
          X3DConstants)
{
	with (Fields)
	{
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
			X3DNode      .call (this, executionContext .getBrowser (), executionContext);
			X3DUrlObject .call (this, executionContext .getBrowser (), executionContext);

			this .valid = false;

			this .addType (X3DConstants .ShaderPart);
		}

		ShaderPart .prototype = $.extend (new X3DNode (),
			X3DUrlObject .prototype,
		{
			constructor: ShaderPart,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata", new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "type",     new SFString ("VERTEX")),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "url",      new MFString ()),
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

				this .requestImmediateLoad ();
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
			requestImmediateLoad: function ()
			{
				if (this .checkLoadState () == X3DConstants .COMPLETE_STATE || this .checkLoadState () == X3DConstants .IN_PROGRESS_STATE)
					return;
	
				this .setLoadState (X3DConstants .IN_PROGRESS_STATE);
				
				this .valid = false;

				var gl = this .getBrowser () .getContext ();

				for (var i = 0; i < this .url_. length; ++ i)
				{
					var string = this .url_ [i] .replace (/^data\:.*?,/, "");

					gl .shaderSource (this .shader, string);
					gl .compileShader (this .shader);

					this .valid = gl .getShaderParameter (this .shader, gl .COMPILE_STATUS);

					if (this .valid)
						break;

					this .getBrowser () .print (this .getTypeName () + ": " + gl .getShaderInfoLog (this .shader));
				}

				this .setLoadState (this .valid ? X3DConstants .COMPLETE_STATE : X3DConstants .FAILED_STATE);
			},
		});

		return ShaderPart;
	}
});
