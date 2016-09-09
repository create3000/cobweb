/* -*- Mode: JavaScript; coding: utf-8; tab-width: 3; indent-tabs-mode: tab; c-basic-offset: 3 -*-
 *******************************************************************************
 *
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * Copyright create3000, Scheffelstraße 31a, Leipzig, Germany 2011.
 *
 * All rights reserved. Holger Seelig <holger.seelig@yahoo.de>.
 *
 * The copyright notice above does not evidence any actual of intended
 * publication of such source code, and is an unpublished work by create3000.
 * This material contains CONFIDENTIAL INFORMATION that is the property of
 * create3000.
 *
 * No permission is granted to copy, distribute, or create derivative works from
 * the contents of this software, in whole or in part, without the prior written
 * permission of create3000.
 *
 * NON-MILITARY USE ONLY
 *
 * All create3000 software are effectively free software with a non-military use
 * restriction. It is free. Well commented source is provided. You may reuse the
 * source in any way you please with the exception anything that uses it must be
 * marked to indicate is contains 'non-military use only' components.
 *
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * Copyright 2015, 2016 Holger Seelig <holger.seelig@yahoo.de>.
 *
 * This file is part of the Cobweb Project.
 *
 * Cobweb is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License version 3 only, as published by the
 * Free Software Foundation.
 *
 * Cobweb is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU General Public License version 3 for more
 * details (a copy is included in the LICENSE file that accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version 3
 * along with Cobweb.  If not, see <http://www.gnu.org/licenses/gpl.html> for a
 * copy of the GPLv3 License.
 *
 * For Silvio, Joy and Adi.
 *
 ******************************************************************************/


define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Shaders/X3DShaderNode",
	"cobweb/Components/Shaders/X3DProgrammableShaderObject",
	"cobweb/Components/Networking/LoadSensor",
	"cobweb/Bits/X3DCast",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Matrix3",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DShaderNode, 
          X3DProgrammableShaderObject, 
          LoadSensor,
          X3DCast,
          X3DConstants,
          Matrix3)
{
"use strict";

	var
		MAX_CLIP_PLANES = 6,
		MAX_LIGHTS      = 8,
		MAX_TEXTURES    = 1;

	var shader = null;

	function ComposedShader (executionContext)
	{
		X3DShaderNode               .call (this, executionContext);
		X3DProgrammableShaderObject .call (this, executionContext);

		this .addType (X3DConstants .ComposedShader);

		this .loadSensor            = new LoadSensor (executionContext);
		this .clipPlane             = [ ];
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
		wireframe: false,
		normalMatrixArray: new Float32Array (9),
		maxClipPlanes: MAX_CLIP_PLANES,
		noClipPlane: new Float32Array (4),
		fogNode: null,
		maxLights: MAX_LIGHTS,
		numGlobalLights: 0,
		textureTypeArray: new Int32Array (MAX_TEXTURES),
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

			var gl = this .getBrowser () .getContext ();

			this .primitiveMode = gl .TRIANGLES;

			this .activate_ .addInterest (this, "set_activate__");
			this .parts_    .addFieldInterest (this .loadSensor .watchList_);

			this .loadSensor .isLoaded_ .addInterest (this, "set_loaded__");
			this .loadSensor .watchList_ = this .parts_;
			this .loadSensor .setup ();
		},
		getProgram: function ()
		{
			return this .program;
		},
		set_activate__: function ()
		{
			if (this .activate_ .getValue ())
				this .set_loaded__ ();
		},
		set_loaded__: function ()
		{
			if (this .loadSensor .isLoaded_ .getValue ())
			{
				var
					gl      = this .getBrowser () .getContext (),
					program = gl .createProgram (),
					parts   = this .parts_ .getValue (),
					valid   = 0;
				
				if (this .isValid_ .getValue ())
					this .removeShaderFields ();
	
				this .program = program;
	
				for (var i = 0, length = parts .length; i < length; ++ i)
				{
					var partNode = X3DCast (X3DConstants .ShaderPart, parts [i]);

					if (partNode)
					{
						valid += partNode .isValid ();
						gl .attachShader (program, partNode .getShader ());
					}
				}
	
				if (valid)
				{
					this .bindAttribLocations (gl, program);

					gl .linkProgram (program);

					valid = valid && gl .getProgramParameter (program, gl .LINK_STATUS);
				}
	
				if (valid != this .isValid_ .getValue ())
					this .isValid_ = valid;
	
				if (valid)
				{
					this .getDefaultUniforms ();
					this .addShaderFields ();
				}
				else
					console .warn ("Couldn't initialize " + this .getTypeName () + " '" + this .getName () + "'.");
			}
			else
			{
				if (this .isValid_ .getValue ())
					this .isValid_ = false;
			}
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

			this .geometryType = gl .getUniformLocation (program, "x3d_GeometryType");

			for (var i = 0; i < this .maxClipPlanes; ++ i)
				this .clipPlane [i]  = gl .getUniformLocation (program, "x3d_ClipPlane[" + i + "]");

			this .fogType            = gl .getUniformLocation (program, "x3d_FogType");
			this .fogColor           = gl .getUniformLocation (program, "x3d_FogColor");
			this .fogVisibilityRange = gl .getUniformLocation (program, "x3d_FogVisibilityRange");

			this .linewidthScaleFactor = gl .getUniformLocation (program, "x3d_LinewidthScaleFactor");

			this .lighting      = gl .getUniformLocation (program, "x3d_Lighting");
			this .colorMaterial = gl .getUniformLocation (program, "x3d_ColorMaterial");

			for (var i = 0; i < this .maxLights; ++ i)
			{
				this .lightType [i]             = gl .getUniformLocation (program, "x3d_LightType[" + i + "]");
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

			this .textureType    = gl .getUniformLocation (program, "x3d_TextureType");
			this .texture2D      = gl .getUniformLocation (program, "x3d_Texture2D");
			this .cubeMapTexture = gl .getUniformLocation (program, "x3d_CubeMapTexture");

			this .texture = gl .getUniformLocation (program, "x3d_Texture"); // depreciated

			this .textureMatrix    = gl .getUniformLocation (program, "x3d_TextureMatrix");
			this .normalMatrix     = gl .getUniformLocation (program, "x3d_NormalMatrix");
			this .projectionMatrix = gl .getUniformLocation (program, "x3d_ProjectionMatrix");
			this .modelViewMatrix  = gl .getUniformLocation (program, "x3d_ModelViewMatrix");
			
			this .color    = gl .getAttribLocation (program, "x3d_Color");
			this .texCoord = gl .getAttribLocation (program, "x3d_TexCoord");
			this .normal   = gl .getAttribLocation (program, "x3d_Normal");
			this .vertex   = gl .getAttribLocation (program, "x3d_Vertex");	

			gl .uniform1i  (this .geometryType,         this .getGeometryType ());
			gl .uniform1f  (this .linewidthScaleFactor, 1);
			gl .uniform1iv (this .textureType,          new Int32Array ([0]));
			gl .uniform1iv (this .texture,              new Int32Array ([0])); // depreciated
			gl .uniform1iv (this .texture2D,            new Int32Array ([0])); // Set texture to active texture unit 0.
			gl .uniform1iv (this .cubeMapTexture,       new Int32Array ([1])); // Set cube map texture to active texture unit 1.
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

			// Set global lights

			this .numGlobalLights = Math .min (this .maxLights, globalLights .length);

			for (var i = 0, length = this .numGlobalLights; i < length; ++ i)
				globalLights [i] .use (gl, this, i);
		},
		setLocalUniforms: function (context)
		{
			var
				browser              = this .getBrowser (),
				gl                   = browser .getContext (),
				linePropertiesNode   = browser .getLineProperties (),
				materialNode         = browser .getMaterial (),
				textureNode          = browser .getTexture (),
				textureTransformNode = browser .getTextureTransform (),
				modelViewMatrix      = context .modelViewMatrix,
				clipPlaneNodes       = context .clipPlanes;

			if (this !== shader)
			{
				shader = this;
				gl .useProgram (this .program);
			}

			// Clip planes

			if (clipPlaneNodes .length)
			{
				for (var i = 0, numClipPlanes = Math .min (this .maxClipPlanes, clipPlaneNodes .length); i < numClipPlanes; ++ i)
					clipPlaneNodes [i] .use (gl, this, i);
	
				if (i < this .maxClipPlanes)
					gl .uniform4fv (this .clipPlane [i], this .noClipPlane);
			}
			else
			{
				gl .uniform4fv (this .clipPlane [0], this .noClipPlane);
			}

			// Fog, there is always one

			if (context .fogNode !== this .fogNode)
			{
				this .fogNode = context .fogNode;
				context .fogNode .use (gl, this);
			}

			// LineProperties

			if (linePropertiesNode && linePropertiesNode .applied_ .getValue ())
			{
				var linewidthScaleFactor = linePropertiesNode .getLinewidthScaleFactor ();

				gl .lineWidth (linewidthScaleFactor);
				gl .uniform1f (this .linewidthScaleFactor, linewidthScaleFactor);
			}
			else
			{
				gl .lineWidth (1);
				gl .uniform1f (this .linewidthScaleFactor, 1);
			}
	
			// Material

			gl .uniform1i (this .colorMaterial, context .colorMaterial);

			if (materialNode)
			{
				// Lights

				var
					localLights = context .localLights,
					numLights   = Math .min (this .maxLights, this .numGlobalLights + localLights .length);

				for (var i = this .numGlobalLights, l = 0; i < numLights; ++ i, ++ l)
					localLights [l] .use (gl, this, i);

				if (numLights < this .maxLights)
					gl .uniform1i (this .lightType [numLights], 0);

				// Material

				gl .uniform1i  (this .lighting,         true);
				gl .uniform1f  (this .ambientIntensity, materialNode .ambientIntensity);
				gl .uniform3fv (this .diffuseColor,     materialNode .diffuseColor);
				gl .uniform3fv (this .specularColor,    materialNode .specularColor);
				gl .uniform3fv (this .emissiveColor,    materialNode .emissiveColor);
				gl .uniform1f  (this .shininess,        materialNode .shininess);
				gl .uniform1f  (this .transparency,     materialNode .transparency);

				if (materialNode .getSeparateBackColor ())
				{
					gl .uniform1i  (this .separateBackColor,    true);
					gl .uniform1f  (this .backAmbientIntensity, materialNode .backAmbientIntensity);
					gl .uniform3fv (this .backDiffuseColor,     materialNode .backDiffuseColor);
					gl .uniform3fv (this .backSpecularColor,    materialNode .backSpecularColor);
					gl .uniform3fv (this .backEmissiveColor,    materialNode .backEmissiveColor);
					gl .uniform1f  (this .backShininess,        materialNode .backShininess);
					gl .uniform1f  (this .backTransparency,     materialNode .backTransparency);
				}
				else
					gl .uniform1i (this .separateBackColor, false);

				try
				{
					// Set normal matrix.
					var normalMatrix = this .normalMatrixArray;
					normalMatrix [0] = modelViewMatrix [0]; normalMatrix [1] = modelViewMatrix [4]; normalMatrix [2] = modelViewMatrix [ 8];
					normalMatrix [3] = modelViewMatrix [1]; normalMatrix [4] = modelViewMatrix [5]; normalMatrix [5] = modelViewMatrix [ 9];
					normalMatrix [6] = modelViewMatrix [2]; normalMatrix [7] = modelViewMatrix [6]; normalMatrix [8] = modelViewMatrix [10];
					Matrix3 .prototype .inverse .call (normalMatrix);
					gl .uniformMatrix3fv (this .normalMatrix, false, normalMatrix);
				}
				catch (error)
				{
					gl .uniformMatrix3fv (this .normalMatrix, false, new Float32Array (Matrix3 .Identity));
				}
			}
			else
			{
				gl .uniform1i (this .lighting, false);

				if (this .getCustom ())
				{
					try
					{
						// Set normal matrix.
						var normalMatrix = this .normalMatrixArray;
						normalMatrix [0] = modelViewMatrix [0]; normalMatrix [1] = modelViewMatrix [4]; normalMatrix [2] = modelViewMatrix [ 8];
						normalMatrix [3] = modelViewMatrix [1]; normalMatrix [4] = modelViewMatrix [5]; normalMatrix [5] = modelViewMatrix [ 9];
						normalMatrix [6] = modelViewMatrix [2]; normalMatrix [7] = modelViewMatrix [6]; normalMatrix [8] = modelViewMatrix [10];
						Matrix3 .prototype .inverse .call (normalMatrix);
						gl .uniformMatrix3fv (this .normalMatrix, false, normalMatrix);
					}
					catch (error)
					{
						gl .uniformMatrix3fv (this .normalMatrix, false, new Float32Array (Matrix3 .Identity));
					}
				}
			}

			if (textureNode)
			{
				textureNode .traverse (gl, this, 0);
				textureTransformNode [0] .traverse ();

				gl .uniformMatrix4fv (this .textureMatrix, false, browser .getTextureTransform () [0] .getMatrixArray ());
			}
			else
			{
				this .textureTypeArray [0] = 0;
				gl .uniform1iv (this .textureType, this .textureTypeArray);

				if (this .getCustom ())
				{
					textureTransformNode .traverse ();
					gl .uniformMatrix4fv (this .textureMatrix, false, browser .getTextureTransform () [0] .getMatrixArray ());
				}
			}

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
