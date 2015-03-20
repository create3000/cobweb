
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Shaders/X3DShaderNode",
	"cobweb/Components/Shaders/X3DProgrammableShaderObject",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DShaderNode, 
          X3DProgrammableShaderObject, 
          X3DConstants)
{
	with (Fields)
	{
		var MAX_LIGHTS = 8;

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

				this .lightType             = [ ];
				this .lightOn               = [ ];
				this .lightColor            = [ ];
				this .lightIntensity        = [ ];
				this .lightAmbientIntensity = [ ];
				this .lightAttenuation      = [ ];
				this .lightLocation         = [ ];
				this .lightDirection        = [ ];
				this .lightBeamWidth        = [ ];
				this .lightCutOffAngle      = [ ];
				this .lightRadius           = [ ];

				for (var i = 0; i < MAX_LIGHTS; ++ i)
				{
					this .lightType [i]             = gl .getUniformLocation (this .program, "x3d_lightType[" + i + "]");
					this .lightOn [i]               = gl .getUniformLocation (this .program, "x3d_lightOn[" + i + "]");
					this .lightColor [i]            = gl .getUniformLocation (this .program, "x3d_lightColor[" + i + "]");
					this .lightAmbientIntensity [i] = gl .getUniformLocation (this .program, "x3d_lightAmbientIntensity[" + i + "]");
					this .lightIntensity [i]        = gl .getUniformLocation (this .program, "x3d_lightIntensity[" + i + "]");
					this .lightAttenuation [i]      = gl .getUniformLocation (this .program, "x3d_lightAttenuation[" + i + "]");
					this .lightLocation [i]         = gl .getUniformLocation (this .program, "x3d_lightLocation[" + i + "]");
					this .lightDirection [i]        = gl .getUniformLocation (this .program, "x3d_lightDirection[" + i + "]");
					this .lightBeamWidth [i]        = gl .getUniformLocation (this .program, "x3d_lightBeamWidth[" + i + "]");
					this .lightCutOffAngle [i]      = gl .getUniformLocation (this .program, "x3d_lightCutOffAngle[" + i + "]");
					this .lightRadius [i]           = gl .getUniformLocation (this .program, "x3d_lightRadius[" + i + "]");
				}

				this .ambientIntensity = gl .getUniformLocation (this .program, "x3d_ambientIntensity");
				this .diffuseColor     = gl .getUniformLocation (this .program, "x3d_diffuseColor");
				this .specularColor    = gl .getUniformLocation (this .program, "x3d_specularColor");
				this .emissiveColor    = gl .getUniformLocation (this .program, "x3d_emissiveColor");
				this .shininess        = gl .getUniformLocation (this .program, "x3d_shininess");
				this .transparency     = gl .getUniformLocation (this .program, "x3d_transparency");

				this .texturing = gl .getUniformLocation (this .program, "x3d_texturing");
				this .texture   = gl .getUniformLocation (this .program, "x3d_texture");

				this .textureMatrix    = gl .getUniformLocation (this .program, "x3d_textureMatrix");
				this .normalMatrix     = gl .getUniformLocation (this .program, "x3d_normalMatrix");
				this .projectionMatrix = gl .getUniformLocation (this .program, "x3d_projectionMatrix");
				this .modelViewMatrix  = gl .getUniformLocation (this .program, "x3d_modelViewMatrix");

				this .color    = gl .getAttribLocation (this .program, "x3d_color");
				this .texCoord = gl .getAttribLocation (this .program, "x3d_texCoord");
				this .normal   = gl .getAttribLocation (this .program, "x3d_normal");
				this .position = gl .getAttribLocation (this .program, "x3d_position");			
			},
			setGlobalLights: function ()
			{
				var browser      = this .getBrowser ();
				var gl           = browser .getContext ();
				var globalLights = browser .getGlobalLights ();

				gl .useProgram (this .program);

				for (var i = 0; i < globalLights .length; ++ i)
					globalLights [i] .use (gl, this, i);
			},
			setDefaultUniforms: function (context)
			{
				var browser = this .getBrowser ();
				var gl      = browser .getContext ();

				gl .useProgram (this .program);

				var material = browser .getMaterial ();
				var texture  = browser .getTexture ();

				gl .uniform1i (this .colorMaterial, context .colorMaterial);

				if (material)
				{
					// Lights

					var globalLights = browser .getGlobalLights ();
					var localLights  = context .localLights;
					var lights       = Math .min (MAX_LIGHTS, globalLights .length + localLights .length);
			
					if (this !== browser .getDefaultShader ())
						this .setGlobalLights ();

					for (var i = globalLights .length, l = 0; i < lights; ++ i, ++ l)
						context .localLights [l] .use (gl, this, i);

					for (var i = lights; i < MAX_LIGHTS; ++ i)
						gl .uniform1i (this .lightOn [i], false);

					// Material

					gl .uniform1i  (this .lighting,         true);
					gl .uniform1f  (this .ambientIntensity, material .ambientIntensity);
					gl .uniform3fv (this .diffuseColor,     material .diffuseColor);
					gl .uniform3fv (this .specularColor,    material .specularColor);
					gl .uniform3fv (this .emissiveColor,    material .emissiveColor);
					gl .uniform1f  (this .shininess,        material .shininess);
					gl .uniform1f  (this .transparency,     material .transparency);
				}
				else
				{
					gl .uniform1i (this .lighting, false);				
				}
	
				if (texture)
				{
					texture .traverse ();

					gl .uniform1i (this .texturing, true);
					gl .uniform1i (this .texture,   0);

					gl .uniformMatrix4fv (this .textureMatrix, false, browser .getTextureTransform () [0] .getMatrix () .array);
				}
				else
					gl .uniform1i (this .texturing, false);

				gl .uniformMatrix4fv (this .projectionMatrix, false, browser .getProjectionMatrix () .array);
				gl .uniformMatrix4fv (this .modelViewMatrix,  false, new Float32Array (context .modelViewMatrix));
				gl .uniformMatrix3fv (this .normalMatrix,     false, new Float32Array (context .modelViewMatrix .submatrix .inverse () .transpose ()));	
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
