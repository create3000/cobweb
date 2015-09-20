
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Shaders/X3DShaderNode",
	"cobweb/Components/Shaders/X3DProgrammableShaderObject",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Matrix3",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DShaderNode, 
          X3DProgrammableShaderObject, 
          X3DConstants,
          Matrix3)
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

		ComposedShader .prototype = $.extend (Object .create (X3DShaderNode .prototype),
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
			maxLights: MAX_LIGHTS,
			settings: {
				shader: null,
				lights: MAX_LIGHTS,
			},
			wireframe: false,
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
				X3DShaderNode               .prototype .initialize .call (this);
				X3DProgrammableShaderObject .prototype .initialize .call (this);

				this .normalMatrixArray = new Float32Array (9);
				this .relink ();
			},
			relink: function ()
			{
				var
					gl      = this .getBrowser () .getContext (),
					program = gl .createProgram ();

				this .program = program;

				for (var i = 0, length = this .parts_ .length; i < length; ++ i)
					gl .attachShader (program, this .parts_ [i] .getValue () .getShader ());
	
				this .bindAttribLocations (gl, program);

				gl .linkProgram (program);

				this .isValid_ = gl .getProgramParameter (program, gl .LINK_STATUS);

				if (this .isValid_ .getValue ())
					this .getDefaultUniforms ();
				else
					this .getBrowser () .print ("Could not initialise shaders!");
			},
			bindAttribLocations: function (gl, program)
			{
				gl .bindAttribLocation (program, 3, "x3d_Color");
				gl .bindAttribLocation (program, 2, "x3d_TexCoord");
				gl .bindAttribLocation (program, 1, "x3d_Normal");
				gl .bindAttribLocation (program, 0, "x3d_Vertex");
			},
			getDefaultUniforms: function ()
			{
				// Get uniforms and attributes.

				var
					gl      = this .getBrowser () .getContext (),
					program = this .program;

				gl .useProgram (program);

				this .fogType            = gl .getUniformLocation (program, "x3d_fogType");
				this .fogColor           = gl .getUniformLocation (program, "x3d_fogColor");
				this .fogVisibilityRange = gl .getUniformLocation (program, "x3d_fogVisibilityRange");

				this .lighting      = gl .getUniformLocation (program, "x3d_Lighting");
				this .colorMaterial = gl .getUniformLocation (program, "x3d_ColorMaterial");

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

				for (var i = 0; i < this .maxLights; ++ i)
				{
					this .lightType [i]             = gl .getUniformLocation (program, "x3d_LightType[" + i + "]");
					this .lightOn [i]               = gl .getUniformLocation (program, "x3d_LightOn[" + i + "]");
					this .lightColor [i]            = gl .getUniformLocation (program, "x3d_LightColor[" + i + "]");
					this .lightAmbientIntensity [i] = gl .getUniformLocation (program, "x3d_LightAmbientIntensity[" + i + "]");
					this .lightIntensity [i]        = gl .getUniformLocation (program, "x3d_LightIntensity[" + i + "]");
					this .lightAttenuation [i]      = gl .getUniformLocation (program, "x3d_LightAttenuation[" + i + "]");
					this .lightLocation [i]         = gl .getUniformLocation (program, "x3d_LightLocation[" + i + "]");
					this .lightDirection [i]        = gl .getUniformLocation (program, "x3d_LightDirection[" + i + "]");
					this .lightBeamWidth [i]        = gl .getUniformLocation (program, "x3d_LightBeamWidth[" + i + "]");
					this .lightCutOffAngle [i]      = gl .getUniformLocation (program, "x3d_LightCutOffAngle[" + i + "]");
					this .lightRadius [i]           = gl .getUniformLocation (program, "x3d_LightRadius[" + i + "]");
				}

				this .ambientIntensity = gl .getUniformLocation (program, "x3d_AmbientIntensity");
				this .diffuseColor     = gl .getUniformLocation (program, "x3d_DiffuseColor");
				this .specularColor    = gl .getUniformLocation (program, "x3d_SpecularColor");
				this .emissiveColor    = gl .getUniformLocation (program, "x3d_EmissiveColor");
				this .shininess        = gl .getUniformLocation (program, "x3d_Shininess");
				this .transparency     = gl .getUniformLocation (program, "x3d_Transparency");

				this .texturing = gl .getUniformLocation (program, "x3d_Texturing");
				this .texture   = gl .getUniformLocation (program, "x3d_Texture");

				this .textureMatrix    = gl .getUniformLocation (program, "x3d_TextureMatrix");
				this .normalMatrix     = gl .getUniformLocation (program, "x3d_NormalMatrix");
				this .projectionMatrix = gl .getUniformLocation (program, "x3d_ProjectionMatrix");
				this .modelViewMatrix  = gl .getUniformLocation (program, "x3d_ModelViewMatrix");
				
				this .color    = gl .getAttribLocation (program, "x3d_Color");
				this .texCoord = gl .getAttribLocation (program, "x3d_TexCoord");
				this .normal   = gl .getAttribLocation (program, "x3d_Normal");
				this .vertex   = gl .getAttribLocation (program, "x3d_Vertex");	

				// Set texture to active texture unit 0.
				gl .uniform1i (this .texture, 0);
			},
			setGlobalUniforms: function ()
			{
				var
					browser      = this .getBrowser (),
					gl           = browser .getContext (),
					globalLights = browser .getGlobalLights ();

				gl .useProgram (this .program);

				for (var i = 0; i < globalLights .length; ++ i)
					globalLights [i] .use (gl, this, i);

				this .settings .shader = null;
			},
			setLocalUniforms: function (context)
			{
				var
					settings        = this .settings,
					browser         = this .getBrowser (),
					gl              = browser .getContext (),
					material        = browser .getMaterial (),
					texture         = browser .getTexture (),
					modelViewMatrix = context .modelViewMatrix,
					customShader    = (this !== browser .getDefaultShader ());

				if (settings .shader !== this)
				{
					settings .shader = this;
					gl .useProgram (this .program);
					gl .uniformMatrix4fv (this .projectionMatrix, false, browser .getProjectionMatrixArray ());
				}

				context .fog .use (gl, this);
				gl .uniform1i (this .colorMaterial, context .colorMaterial);

				if (material)
				{
					// Lights

					var
						globalLights = browser .getGlobalLights (),
						localLights  = context .localLights,
						lights       = Math .min (this .maxLights, globalLights .length + localLights .length),
						lightOn      = this .lightOn;

					if (customShader)
					{
						for (var i = 0; i < globalLights .length; ++ i)
							globalLights [i] .use (gl, this, i);
					}

					for (var i = globalLights .length, l = 0; i < lights; ++ i, ++ l)
						localLights [l] .use (gl, this, i);

					for (var length = settings .lights; i < length; ++ i)
						gl .uniform1i (lightOn [i], false);

					settings .lights = lights;

					// Material

					gl .uniform1i  (this .lighting,         true);
					gl .uniform1f  (this .ambientIntensity, material .ambientIntensity);
					gl .uniform3fv (this .diffuseColor,     material .diffuseColor);
					gl .uniform3fv (this .specularColor,    material .specularColor);
					gl .uniform3fv (this .emissiveColor,    material .emissiveColor);
					gl .uniform1f  (this .shininess,        material .shininess);
					gl .uniform1f  (this .transparency,     material .transparency);

					// Set normal matrix.
					var normalMatrix = this .normalMatrixArray;
					normalMatrix [0] = modelViewMatrix [0]; normalMatrix [1] = modelViewMatrix [4]; normalMatrix [2] = modelViewMatrix [ 8];
					normalMatrix [3] = modelViewMatrix [1]; normalMatrix [4] = modelViewMatrix [5]; normalMatrix [5] = modelViewMatrix [ 9];
					normalMatrix [6] = modelViewMatrix [2]; normalMatrix [7] = modelViewMatrix [6]; normalMatrix [8] = modelViewMatrix [10];
					Matrix3 .prototype .inverse .call (normalMatrix);
					gl .uniformMatrix3fv (this .normalMatrix, false, normalMatrix);
				}
				else
				{
					gl .uniform1i (this .lighting, false);

					if (customShader)
					{
						// Set normal matrix.
						var normalMatrix = this .normalMatrixArray;
						normalMatrix [0] = modelViewMatrix [0]; normalMatrix [1] = modelViewMatrix [4]; normalMatrix [2] = modelViewMatrix [ 8];
						normalMatrix [3] = modelViewMatrix [1]; normalMatrix [4] = modelViewMatrix [5]; normalMatrix [5] = modelViewMatrix [ 9];
						normalMatrix [6] = modelViewMatrix [2]; normalMatrix [7] = modelViewMatrix [6]; normalMatrix [8] = modelViewMatrix [10];
						Matrix3 .prototype .inverse .call (normalMatrix);
						gl .uniformMatrix3fv (this .normalMatrix, false, normalMatrix);
					}
				}

				if (texture)
				{
					texture .traverse ();
					gl .uniform1i (this .texturing, true);
					gl .uniformMatrix4fv (this .textureMatrix, false, browser .getTextureTransform () [0] .getMatrixArray ());
					// Active texture 0 is set on initialization.
				}
				else
					gl .uniform1i (this .texturing, false);

				// Set model view matrix
				gl .uniformMatrix4fv (this .modelViewMatrix, false, modelViewMatrix);
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
