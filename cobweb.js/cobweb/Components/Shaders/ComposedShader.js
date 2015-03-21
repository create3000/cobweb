
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
				this .normalMatrixArray    = new Float32Array (9);
				this .modelViewMatrixArray = new Float32Array (16);
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

				this .lighting         = gl .getUniformLocation (this .program, "x3d_Lighting");
				this .colorMaterial    = gl .getUniformLocation (this .program, "x3d_ColorMaterial");

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
					this .lightType [i]             = gl .getUniformLocation (this .program, "x3d_LightType[" + i + "]");
					this .lightOn [i]               = gl .getUniformLocation (this .program, "x3d_LightOn[" + i + "]");
					this .lightColor [i]            = gl .getUniformLocation (this .program, "x3d_LightColor[" + i + "]");
					this .lightAmbientIntensity [i] = gl .getUniformLocation (this .program, "x3d_LightAmbientIntensity[" + i + "]");
					this .lightIntensity [i]        = gl .getUniformLocation (this .program, "x3d_LightIntensity[" + i + "]");
					this .lightAttenuation [i]      = gl .getUniformLocation (this .program, "x3d_LightAttenuation[" + i + "]");
					this .lightLocation [i]         = gl .getUniformLocation (this .program, "x3d_LightLocation[" + i + "]");
					this .lightDirection [i]        = gl .getUniformLocation (this .program, "x3d_LightDirection[" + i + "]");
					this .lightBeamWidth [i]        = gl .getUniformLocation (this .program, "x3d_LightBeamWidth[" + i + "]");
					this .lightCutOffAngle [i]      = gl .getUniformLocation (this .program, "x3d_LightCutOffAngle[" + i + "]");
					this .lightRadius [i]           = gl .getUniformLocation (this .program, "x3d_LightRadius[" + i + "]");
				}

				this .ambientIntensity = gl .getUniformLocation (this .program, "x3d_AmbientIntensity");
				this .diffuseColor     = gl .getUniformLocation (this .program, "x3d_DiffuseColor");
				this .specularColor    = gl .getUniformLocation (this .program, "x3d_SpecularColor");
				this .emissiveColor    = gl .getUniformLocation (this .program, "x3d_EmissiveColor");
				this .shininess        = gl .getUniformLocation (this .program, "x3d_Shininess");
				this .transparency     = gl .getUniformLocation (this .program, "x3d_Transparency");

				this .texturing = gl .getUniformLocation (this .program, "x3d_Texturing");
				this .texture   = gl .getUniformLocation (this .program, "x3d_Texture");

				this .textureMatrix    = gl .getUniformLocation (this .program, "x3d_TextureMatrix");
				this .normalMatrix     = gl .getUniformLocation (this .program, "x3d_NormalMatrix");
				this .projectionMatrix = gl .getUniformLocation (this .program, "x3d_ProjectionMatrix");
				this .modelViewMatrix  = gl .getUniformLocation (this .program, "x3d_ModelViewMatrix");

				this .color    = gl .getAttribLocation (this .program, "x3d_Color");
				this .texCoord = gl .getAttribLocation (this .program, "x3d_TexCoord");
				this .normal   = gl .getAttribLocation (this .program, "x3d_Normal");
				this .position = gl .getAttribLocation (this .program, "x3d_Vertex");			
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
				var
					browser  = this .getBrowser (),
					gl       = browser .getContext (),
					material = browser .getMaterial (),
					texture  = browser .getTexture ();

				gl .useProgram (this .program);
				gl .uniform1i (this .colorMaterial, context .colorMaterial);

				if (material)
				{
					// Lights

					var
						globalLights = browser .getGlobalLights (),
						localLights  = context .localLights,
						lights       = Math .min (MAX_LIGHTS, globalLights .length + localLights .length),
						lightOn      = this .lightOn;

					if (this !== browser .getDefaultShader ())
					{
						for (var i = 0; i < globalLights .length; ++ i)
							globalLights [i] .use (gl, this, i);
					}

					for (var i = globalLights .length, l = 0; i < lights; ++ i, ++ l)
						localLights [l] .use (gl, this, i);

					for (var i = lights; i < MAX_LIGHTS; ++ i)
						gl .uniform1i (lightOn [i], false);

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

				this .normalMatrixArray    .set (context .modelViewMatrix .normalMatrix);
				this .modelViewMatrixArray .set (context .modelViewMatrix);

				gl .uniformMatrix3fv (this .normalMatrix,     false, this .normalMatrixArray);	
				gl .uniformMatrix4fv (this .projectionMatrix, false, browser .getProjectionMatrix () .array);
				gl .uniformMatrix4fv (this .modelViewMatrix,  false, this .modelViewMatrixArray);
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
