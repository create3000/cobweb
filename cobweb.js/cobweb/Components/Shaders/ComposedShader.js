
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
"use strict";

	var
		MAX_CLIP_PLANES = 6,
		MAX_LIGHTS      = 8;

	var shader = null;

	function ComposedShader (executionContext)
	{
		X3DShaderNode               .call (this, executionContext .getBrowser (), executionContext);
		X3DProgrammableShaderObject .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .ComposedShader);

		this .clipPlaneEnabled      = [ ];
		this .clipPlaneVector       = [ ];
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
	}

	ComposedShader .prototype = $.extend (Object .create (X3DShaderNode .prototype),
		X3DProgrammableShaderObject .prototype,
	{
		constructor: ComposedShader,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",   new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "activate",   new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "isSelected", new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "isValid",    new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "language",   new Fields .SFString ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "parts",      new Fields .MFNode ()),
		]),
		normalMatrixArray: new Float32Array (9),
		maxClipPlanes: MAX_CLIP_PLANES,
		numClipPlanes: MAX_CLIP_PLANES,
		fog: null,
		maxLights: MAX_LIGHTS,
		numLights: MAX_LIGHTS,
		globalLights: 0,
		custom: true,
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

			this .relink ();
		},
		setCustom: function (value)
		{
			this .custom = value;
		},
		getCustom: function (value)
		{
			return this .custom;
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

			shader = this;
			gl .useProgram (program);

			this .points       = gl .getUniformLocation (program, "X3D_Points");
			this .geometryType = gl .getUniformLocation (program, "X3D_Dimension");

			for (var i = 0; i < this .maxClipPlanes; ++ i)
			{
				this .clipPlaneEnabled [i] = gl .getUniformLocation (program, "x3d_ClipPlaneEnabled[" + i + "]");
				this .clipPlaneVector [i]  = gl .getUniformLocation (program, "x3d_ClipPlaneVector[" + i + "]");
			}

			this .fogType            = gl .getUniformLocation (program, "x3d_FogType");
			this .fogColor           = gl .getUniformLocation (program, "x3d_FogColor");
			this .fogVisibilityRange = gl .getUniformLocation (program, "x3d_FogVisibilityRange");

			this .linewidthScaleFactor = gl .getUniformLocation (program, "x3d_LinewidthScaleFactor");

			this .lighting      = gl .getUniformLocation (program, "x3d_Lighting");
			this .colorMaterial = gl .getUniformLocation (program, "x3d_ColorMaterial");

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

			this .separateBackColor = gl .getUniformLocation (program, "x3d_SeparateBackColor");

			this .ambientIntensity = gl .getUniformLocation (program, "x3d_AmbientIntensity");
			this .diffuseColor     = gl .getUniformLocation (program, "x3d_DiffuseColor");
			this .specularColor    = gl .getUniformLocation (program, "x3d_SpecularColor");
			this .emissiveColor    = gl .getUniformLocation (program, "x3d_EmissiveColor");
			this .shininess        = gl .getUniformLocation (program, "x3d_Shininess");
			this .transparency     = gl .getUniformLocation (program, "x3d_Transparency");

			this .backAmbientIntensity = gl .getUniformLocation (program, "x3d_BackAmbientIntensity");
			this .backDiffuseColor     = gl .getUniformLocation (program, "x3d_BackDiffuseColor");
			this .backSpecularColor    = gl .getUniformLocation (program, "x3d_BackSpecularColor");
			this .backEmissiveColor    = gl .getUniformLocation (program, "x3d_BackEmissiveColor");
			this .backShininess        = gl .getUniformLocation (program, "x3d_BackShininess");
			this .backTransparency     = gl .getUniformLocation (program, "x3d_BackTransparency");

			this .texturing    = gl .getUniformLocation (program, "x3d_Texturing");
			this .texture      = gl .getUniformLocation (program, "x3d_Texture");

			this .textureMatrix    = gl .getUniformLocation (program, "x3d_TextureMatrix");
			this .normalMatrix     = gl .getUniformLocation (program, "x3d_NormalMatrix");
			this .projectionMatrix = gl .getUniformLocation (program, "x3d_ProjectionMatrix");
			this .modelViewMatrix  = gl .getUniformLocation (program, "x3d_ModelViewMatrix");
			
			this .color    = gl .getAttribLocation (program, "x3d_Color");
			this .texCoord = gl .getAttribLocation (program, "x3d_TexCoord");
			this .normal   = gl .getAttribLocation (program, "x3d_Normal");
			this .vertex   = gl .getAttribLocation (program, "x3d_Vertex");	

			gl .uniform1i (this .geometryType, 3);
			gl .uniform1f (this .linewidthScaleFactor, 1);
			gl .uniform1i (this .texture, 0);
			// Set texture to active texture unit 0.
		},
		setGlobalUniforms: function ()
		{
			var
				browser      = this .getBrowser (),
				gl           = browser .getContext (),
				globalLights = browser .getGlobalLights ();

			shader = this;
			gl .useProgram (this .program);
			gl .uniformMatrix4fv (this .projectionMatrix, false, browser .getProjectionMatrixArray ());

			this .globalLights = Math .min (this .maxLights, globalLights .length);

			for (var i = 0, length = this .globalLights; i < length; ++ i)
				globalLights [i] .use (gl, this, i);
		},
		setLocalUniforms: function (context)
		{
			var
				browser         = this .getBrowser (),
				gl              = browser .getContext (),
				appearance      = browser .getAppearance (),
				lineProperties  = appearance .getLineProperties (),
				material        = appearance .getMaterial (),
				texture         = appearance .getTexture (),
				modelViewMatrix = context .modelViewMatrix,
				clipPlanes      = context .clipPlanes;

			if (this !== shader)
			{
				shader = this;
				gl .useProgram (this .program);
			}

			// Clip planes

			for (var i = 0, numClipPlanes = Math .min (this .maxClipPlanes, clipPlanes .length); i < numClipPlanes; ++ i)
				clipPlanes [i] .use (gl, this, i);

			if (i < this .numClipPlanes)
				gl .uniform1i (this .clipPlaneEnabled [i], false);

			this .numClipPlanes = i;

			// Fog

			if (context .fog !== this .fog)
			{
				this .fog = context .fog;
				context .fog .use (gl, this);
			}

			// LineProperties

			if (lineProperties !== browser .getLineProperties ())
			{
				browser .setLineProperties (lineProperties);

				if (lineProperties && lineProperties .applied_ .getValue ())
				{
					var linewidthScaleFactor = lineProperties .linewidthScaleFactor_ .getValue ();

					gl .lineWidth (linewidthScaleFactor);
					gl .uniform1f (this .linewidthScaleFactor, linewidthScaleFactor);
				}
				else
				{
					gl .lineWidth (1);
					gl .uniform1f (this .linewidthScaleFactor, 1);
				}
			}

			// Material

			gl .uniform1i (this .colorMaterial, context .colorMaterial);

			if (material)
			{
				// Lights

				var
					globalLights = browser .getGlobalLights (),
					localLights  = context .localLights,
					numLights    = Math .min (this .maxLights, globalLights .length + localLights .length);

				if (this .custom)
				{
					for (var i = 0, length = this .globalLights; i < length; ++ i)
						globalLights [i] .use (gl, this, i);
				}

				for (var i = this .globalLights, l = 0; i < numLights; ++ i, ++ l)
					localLights [l] .use (gl, this, i);

				if (i < this .numLights)
					gl .uniform1i (this .lightOn [i], false);

				this .numLights = i;

				// Material

				gl .uniform1i  (this .lighting,         true);
				gl .uniform1f  (this .ambientIntensity, material .ambientIntensity);
				gl .uniform3fv (this .diffuseColor,     material .diffuseColor);
				gl .uniform3fv (this .specularColor,    material .specularColor);
				gl .uniform3fv (this .emissiveColor,    material .emissiveColor);
				gl .uniform1f  (this .shininess,        material .shininess);
				gl .uniform1f  (this .transparency,     material .transparency);

				if (material .getSeparateBackColor ())
				{
					gl .uniform1i  (this .separateBackColor,    true);
					gl .uniform1f  (this .backAmbientIntensity, material .backAmbientIntensity);
					gl .uniform3fv (this .backDiffuseColor,     material .backDiffuseColor);
					gl .uniform3fv (this .backSpecularColor,    material .backSpecularColor);
					gl .uniform3fv (this .backEmissiveColor,    material .backEmissiveColor);
					gl .uniform1f  (this .backShininess,        material .backShininess);
					gl .uniform1f  (this .backTransparency,     material .backTransparency);
				}
				else
					gl .uniform1i (this .separateBackColor, false);

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

				if (this .custom)
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
				appearance .getTextureTransform () .traverse ();
				texture .traverse ();

				gl .uniform1i (this .texturing, true);
				gl .uniformMatrix4fv (this .textureMatrix, false, browser .getTextureTransform () [0] .getMatrixArray ());
				// Active texture 0 is set on initialization.
			}
			else
			{
				gl .uniform1i (this .texturing, false);

				if (this .custom)
				{
					appearance .getTextureTransform () .traverse ();
					gl .uniformMatrix4fv (this .textureMatrix, false, browser .getTextureTransform () [0] .getMatrixArray ());
					// Active texture 0 is set on initialization.
				}
			}

			// Set model view matrix
			gl .uniformMatrix4fv (this .modelViewMatrix, false, modelViewMatrix);
		},
		use: function ()
		{
			if (this === shader)
				return;

			shader = this;

			this .getBrowser () .getContext () .useProgram (this .program);
		},
	});

	return ComposedShader;
});
