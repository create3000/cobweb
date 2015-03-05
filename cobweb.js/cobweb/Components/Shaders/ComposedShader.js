
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
					this .getDefaultUniforms ();
				else
					this .getBrowser () .print ("Could not initialise shaders!");
			},
			getDefaultUniforms: function ()
			{
				// Get uniforms and attributes.

				var gl = this .getBrowser () .getContext ();

				gl .useProgram (this .program);

				this .lighting         = gl .getUniformLocation (this .program, "x3d_lighting");
				this .colorMaterial    = gl .getUniformLocation (this .program, "x3d_colorMaterial");
				this .ambientIntensity = gl .getUniformLocation (this .program, "x3d_ambientIntensity");
				this .diffuseColor     = gl .getUniformLocation (this .program, "x3d_diffuseColor");
				this .specularColor    = gl .getUniformLocation (this .program, "x3d_specularColor");
				this .emissiveColor    = gl .getUniformLocation (this .program, "x3d_emissiveColor");
				this .shininess        = gl .getUniformLocation (this .program, "x3d_shininess");
				this .transparency     = gl .getUniformLocation (this .program, "x3d_transparency");
				
				this .texturing         = gl .getUniformLocation (this .program, "x3d_texturing");
				this .texture           = gl .getUniformLocation (this .program, "x3d_texture");
				this .textureComponents = gl .getUniformLocation (this .program, "x3d_textureComponents");

				this .textureMatrix    = gl .getUniformLocation (this .program, "x3d_textureMatrix");
				this .normalMatrix     = gl .getUniformLocation (this .program, "x3d_normalMatrix");
				this .projectionMatrix = gl .getUniformLocation (this .program, "x3d_projectionMatrix");
				this .modelViewMatrix  = gl .getUniformLocation (this .program, "x3d_modelViewMatrix");

				this .color    = gl .getAttribLocation (this .program, "x3d_color");
				this .texCoord = gl .getAttribLocation (this .program, "x3d_texCoord");
				this .normal   = gl .getAttribLocation (this .program, "x3d_normal");
				this .position = gl .getAttribLocation (this .program, "x3d_position");
			},
			setDefaultUniforms: function (context)
			{
				var browser  = this .getBrowser ();
				var gl       = browser .getContext ();

				gl .useProgram (this .program);

				if (! context)
					return;

				var material = browser .getMaterial ();
				var texture  = browser .getTexture ();

				gl .uniform1i (this .colorMaterial, context .colorMaterial);

				if (material)
				{
					gl .uniform1i (this .lighting,         true);
					gl .uniform1f (this .ambientIntensity, clamp (material .ambientIntensity_ .getValue (), 0, 1));
					gl .uniform3f (this .diffuseColor,     material .diffuseColor_  .r, material .diffuseColor_  .g, material .diffuseColor_  .b);
					gl .uniform3f (this .specularColor,    material .specularColor_ .r, material .specularColor_ .g, material .specularColor_ .b);
					gl .uniform3f (this .emissiveColor,    material .emissiveColor_ .r, material .emissiveColor_ .g, material .emissiveColor_ .b);
					gl .uniform1f (this .shininess,        clamp (material .shininess_    .getValue (), 0, 1));
					gl .uniform1f (this .transparency,     clamp (material .transparency_ .getValue (), 0, 1));
				}
				else
				{
					gl .uniform1i (this .lighting, false);				
				}
	
				if (texture)
				{
					texture .traverse ();

					gl .uniform1i (this .texturing,         true);
					gl .uniform1i (this .texture,           0);
					gl .uniform1i (this .textureComponents, texture .getComponents ());
				}
				else
					gl .uniform1i (this .texturing, false);

				gl .uniformMatrix4fv (this .textureMatrix,    false, new Float32Array (browser .getTextureTransform () [0] .getMatrix ()));
				gl .uniformMatrix3fv (this .normalMatrix,     false, new Float32Array (context .modelViewMatrix .submatrix .inverse () .transpose ()));	
				gl .uniformMatrix4fv (this .projectionMatrix, false, new Float32Array (browser .getProjectionMatrix () .get ()));
				gl .uniformMatrix4fv (this .modelViewMatrix,  false, new Float32Array (context .modelViewMatrix));
			},
			use: function (context)
			{
				var gl = this .getBrowser () .getContext ();

				gl .useProgram (this .program);
			},
		});

		return ComposedShader;
	}
});

