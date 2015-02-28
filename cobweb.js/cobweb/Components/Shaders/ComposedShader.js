
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Shaders/X3DShaderNode",
	"cobweb/Components/Shaders/X3DProgrammableShaderObject",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Algorithm",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DShaderNode, 
          X3DProgrammableShaderObject, 
          X3DConstants,
          Algorithm)
{
	with (Fields)
	{
		var clamp = Algorithm .clamp;

		function ComposedShader (executionContext)
		{
			X3DShaderNode               .call (this, executionContext .getBrowser (), executionContext);
			X3DProgrammableShaderObject .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .ComposedShader);
		}

		ComposedShader .prototype = $.extend (new X3DShaderNode (),
			X3DProgrammableShaderObject .prototype,
		{
			constructor: ComposedShader,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",   new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "activate",   new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "isSelected", new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "isValid",    new SFBool ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "language",   new SFString ("")),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "parts",      new MFNode ()),
			]),
			getTypeName: function ()
			{
				return "ComposedShader";
			},
			getComponentName: function ()
			{
				return "Shaders";
			},
			getContainerField: function ()
			{
				return "shaders";
			},
			initialize: function ()
			{
				this .relink ();
			},
			relink: function ()
			{
				var gl = this .getBrowser () .getContext ();

				this .program = gl .createProgram ();

				for (var i = 0; i < this .parts_ .length; ++ i)
					gl .attachShader (this .program, this .parts_ [i] .getValue () .getShader ());

				gl .linkProgram (this .program);

				this .isValid_ = gl .getProgramParameter (this .program, gl .LINK_STATUS);

				if (this .isValid_ .getValue ())
					this .getVariables ();
				else
					this .getBrowser () .print ("Could not initialise shaders!");
			},
			getVariables: function ()
			{
				// Get uniforms and attributes.

				var gl = this .getBrowser () .getContext ();

				gl .useProgram (this .program);

				this .ambientIntensity = gl .getUniformLocation (this .program, "ambientIntensity");
				this .diffuseColor     = gl .getUniformLocation (this .program, "diffuseColor");
				this .specularColor    = gl .getUniformLocation (this .program, "specularColor");
				this .emissiveColor    = gl .getUniformLocation (this .program, "emissiveColor");
				this .shininess        = gl .getUniformLocation (this .program, "shininess");
				this .transparency     = gl .getUniformLocation (this .program, "transparency");

				this .normalMatrix     = gl .getUniformLocation (this .program, "normalMatrix");
				this .projectionMatrix = gl .getUniformLocation (this .program, "projectionMatrix");
				this .modelViewMatrix  = gl .getUniformLocation (this .program, "modelViewMatrix");

				this .normal   = gl .getAttribLocation (this .program, "normal");
				this .position = gl .getAttribLocation (this .program, "position");
			},
			use: function (context)
			{
				var browser  = this .getBrowser ();
				var gl       = browser .getContext ();
				var material = browser .getMaterial ();

				gl .useProgram (this .program);

				gl .uniform1f (this .ambientIntensity, clamp (material .ambientIntensity_ .getValue (), 0, 1));
				gl .uniform3f (this .diffuseColor,     material .diffuseColor_  .r, material .diffuseColor_  .g, material .diffuseColor_  .b);
				gl .uniform3f (this .specularColor,    material .specularColor_ .r, material .specularColor_ .g, material .specularColor_ .b);
				gl .uniform3f (this .emissiveColor,    material .emissiveColor_ .r, material .emissiveColor_ .g, material .emissiveColor_ .b);
				gl .uniform1f (this .shininess,        clamp (material .shininess_    .getValue (), 0, 1));
				gl .uniform1f (this .transparency,     clamp (material .transparency_ .getValue (), 0, 1));

				gl .uniformMatrix3fv (this .normalMatrix,     false, new Float32Array (context .modelViewMatrix .submatrix .inverse () .transpose ()));
				gl .uniformMatrix4fv (this .projectionMatrix, false, new Float32Array (browser .getProjectionMatrix () .get ()));
				gl .uniformMatrix4fv (this .modelViewMatrix,  false, new Float32Array (context .modelViewMatrix));
			}
		});

		return ComposedShader;
	}
});

