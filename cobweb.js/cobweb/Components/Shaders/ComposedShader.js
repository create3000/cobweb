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

		this .loadSensor                = new LoadSensor (executionContext);
		this .x3d_ClipPlane             = [ ];
		this .x3d_LightType             = [ ];
		this .x3d_LightOn               = [ ];
		this .x3d_LightColor            = [ ];
		this .x3d_LightIntensity        = [ ];
		this .x3d_LightAmbientIntensity = [ ];
		this .x3d_LightAttenuation      = [ ];
		this .x3d_LightLocation         = [ ];
		this .x3d_LightDirection        = [ ];
		this .x3d_LightBeamWidth        = [ ];
		this .x3d_LightCutOffAngle      = [ ];
		this .x3d_LightRadius           = [ ];
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

			this .x3D_GeometryType = gl .getUniformLocation (program, "x3d_GeometryType");

			for (var i = 0; i < this .maxClipPlanes; ++ i)
				this .x3d_ClipPlane [i]  = gl .getUniformLocation (program, "x3d_ClipPlane[" + i + "]");

			this .x3d_FogType            = gl .getUniformLocation (program, "x3d_FogType");
			this .x3d_FogColor           = gl .getUniformLocation (program, "x3d_FogColor");
			this .x3d_FogVisibilityRange = gl .getUniformLocation (program, "x3d_FogVisibilityRange");

			this .x3d_LinewidthScaleFactor = gl .getUniformLocation (program, "x3d_LinewidthScaleFactor");

			this .x3d_Lighting      = gl .getUniformLocation (program, "x3d_Lighting");
			this .x3d_ColorMaterial = gl .getUniformLocation (program, "x3d_ColorMaterial");

			for (var i = 0; i < this .maxLights; ++ i)
			{
				this .x3d_LightType [i]             = gl .getUniformLocation (program, "x3d_LightType[" + i + "]");
				this .x3d_LightColor [i]            = gl .getUniformLocation (program, "x3d_LightColor[" + i + "]");
				this .x3d_LightAmbientIntensity [i] = gl .getUniformLocation (program, "x3d_LightAmbientIntensity[" + i + "]");
				this .x3d_LightIntensity [i]        = gl .getUniformLocation (program, "x3d_LightIntensity[" + i + "]");
				this .x3d_LightAttenuation [i]      = gl .getUniformLocation (program, "x3d_LightAttenuation[" + i + "]");
				this .x3d_LightLocation [i]         = gl .getUniformLocation (program, "x3d_LightLocation[" + i + "]");
				this .x3d_LightDirection [i]        = gl .getUniformLocation (program, "x3d_LightDirection[" + i + "]");
				this .x3d_LightBeamWidth [i]        = gl .getUniformLocation (program, "x3d_LightBeamWidth[" + i + "]");
				this .x3d_LightCutOffAngle [i]      = gl .getUniformLocation (program, "x3d_LightCutOffAngle[" + i + "]");
				this .x3d_LightRadius [i]           = gl .getUniformLocation (program, "x3d_LightRadius[" + i + "]");
			}

			this .x3d_SeparateBackColor = gl .getUniformLocation (program, "x3d_SeparateBackColor");

			this .x3d_AmbientIntensity = gl .getUniformLocation (program, "x3d_AmbientIntensity");
			this .x3d_DiffuseColor     = gl .getUniformLocation (program, "x3d_DiffuseColor");
			this .x3d_SpecularColor    = gl .getUniformLocation (program, "x3d_SpecularColor");
			this .x3d_EmissiveColor    = gl .getUniformLocation (program, "x3d_EmissiveColor");
			this .x3d_Shininess        = gl .getUniformLocation (program, "x3d_Shininess");
			this .x3d_Transparency     = gl .getUniformLocation (program, "x3d_Transparency");

			this .x3d_BackAmbientIntensity = gl .getUniformLocation (program, "x3d_BackAmbientIntensity");
			this .x3d_BackDiffuseColor     = gl .getUniformLocation (program, "x3d_BackDiffuseColor");
			this .x3d_BackSpecularColor    = gl .getUniformLocation (program, "x3d_BackSpecularColor");
			this .x3d_BackEmissiveColor    = gl .getUniformLocation (program, "x3d_BackEmissiveColor");
			this .x3d_BackShininess        = gl .getUniformLocation (program, "x3d_BackShininess");
			this .x3d_BackTransparency     = gl .getUniformLocation (program, "x3d_BackTransparency");

			this .x3d_TextureType    = gl .getUniformLocation (program, "x3d_TextureType");
			this .x3d_Texture2D      = gl .getUniformLocation (program, "x3d_Texture2D");
			this .x3d_CubeMapTexture = gl .getUniformLocation (program, "x3d_CubeMapTexture");

			this .x3d_Texture = gl .getUniformLocation (program, "x3d_Texture"); // depreciated

			this .x3d_TextureMatrix    = gl .getUniformLocation (program, "x3d_TextureMatrix");
			this .x3d_NormalMatrix     = gl .getUniformLocation (program, "x3d_NormalMatrix");
			this .x3d_ProjectionMatrix = gl .getUniformLocation (program, "x3d_ProjectionMatrix");
			this .x3d_ModelViewMatrix  = gl .getUniformLocation (program, "x3d_ModelViewMatrix");
			
			this .x3d_Color    = gl .getAttribLocation (program, "x3d_Color");
			this .x3d_TexCoord = gl .getAttribLocation (program, "x3d_TexCoord");
			this .x3d_Normal   = gl .getAttribLocation (program, "x3d_Normal");
			this .x3d_Vertex   = gl .getAttribLocation (program, "x3d_Vertex");	

			gl .uniform1f  (this .x3d_LinewidthScaleFactor, 1);
			gl .uniform1iv (this .x3d_TextureType,          new Int32Array ([0]));
			gl .uniform1iv (this .x3d_Texture,              new Int32Array ([0])); // depreciated
			gl .uniform1iv (this .x3d_Texture2D,            new Int32Array ([0])); // Set texture to active texture unit 0.
			gl .uniform1iv (this .x3d_CubeMapTexture,       new Int32Array ([1])); // Set cube map texture to active texture unit 1.
		},
		setGlobalUniforms: function ()
		{
			var
				browser      = this .getBrowser (),
				gl           = browser .getContext (),
				globalLights = browser .getGlobalLights ();

			shader = this;
			gl .useProgram (this .program);
			gl .uniformMatrix4fv (this .x3d_ProjectionMatrix, false, browser .getProjectionMatrixArray ());

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

			// Geometry type

			gl .uniform1i (this .geometryType, context .geometryType);

			// Clip planes

			if (clipPlaneNodes .length)
			{
				for (var i = 0, numClipPlanes = Math .min (this .maxClipPlanes, clipPlaneNodes .length); i < numClipPlanes; ++ i)
					clipPlaneNodes [i] .use (gl, this, i);
	
				if (i < this .maxClipPlanes)
					gl .uniform4fv (this .x3d_ClipPlane [i], this .noClipPlane);
			}
			else
			{
				gl .uniform4fv (this .x3d_ClipPlane [0], this .noClipPlane);
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
				gl .uniform1f (this .x3d_LinewidthScaleFactor, linewidthScaleFactor);
			}
			else
			{
				gl .lineWidth (1);
				gl .uniform1f (this .x3d_LinewidthScaleFactor, 1);
			}
	
			// Material

			gl .uniform1i (this .x3d_ColorMaterial, context .colorMaterial);

			if (materialNode)
			{
				// Lights

				var
					localLights = context .localLights,
					numLights   = Math .min (this .maxLights, this .numGlobalLights + localLights .length);

				for (var i = this .numGlobalLights, l = 0; i < numLights; ++ i, ++ l)
					localLights [l] .use (gl, this, i);

				if (numLights < this .maxLights)
					gl .uniform1i (this .x3d_LightType [numLights], 0);

				// Material

				gl .uniform1i  (this .x3d_Lighting,         true);
				gl .uniform1f  (this .x3d_AmbientIntensity, materialNode .ambientIntensity);
				gl .uniform3fv (this .x3d_DiffuseColor,     materialNode .diffuseColor);
				gl .uniform3fv (this .x3d_SpecularColor,    materialNode .specularColor);
				gl .uniform3fv (this .x3d_EmissiveColor,    materialNode .emissiveColor);
				gl .uniform1f  (this .x3d_Shininess,        materialNode .shininess);
				gl .uniform1f  (this .x3d_Transparency,     materialNode .transparency);

				if (materialNode .getSeparateBackColor ())
				{
					gl .uniform1i  (this .x3d_SeparateBackColor,    true);
					gl .uniform1f  (this .x3d_BackAmbientIntensity, materialNode .backAmbientIntensity);
					gl .uniform3fv (this .x3d_BackDiffuseColor,     materialNode .backDiffuseColor);
					gl .uniform3fv (this .x3d_BackSpecularColor,    materialNode .backSpecularColor);
					gl .uniform3fv (this .x3d_BackEmissiveColor,    materialNode .backEmissiveColor);
					gl .uniform1f  (this .x3d_BackShininess,        materialNode .backShininess);
					gl .uniform1f  (this .x3d_BackTransparency,     materialNode .backTransparency);
				}
				else
					gl .uniform1i (this .x3d_SeparateBackColor, false);

				try
				{
					// Set normal matrix.
					var normalMatrix = this .normalMatrixArray;
					normalMatrix [0] = modelViewMatrix [0]; normalMatrix [1] = modelViewMatrix [4]; normalMatrix [2] = modelViewMatrix [ 8];
					normalMatrix [3] = modelViewMatrix [1]; normalMatrix [4] = modelViewMatrix [5]; normalMatrix [5] = modelViewMatrix [ 9];
					normalMatrix [6] = modelViewMatrix [2]; normalMatrix [7] = modelViewMatrix [6]; normalMatrix [8] = modelViewMatrix [10];
					Matrix3 .prototype .inverse .call (normalMatrix);
					gl .uniformMatrix3fv (this .x3d_NormalMatrix, false, normalMatrix);
				}
				catch (error)
				{
					gl .uniformMatrix3fv (this .x3d_NormalMatrix, false, new Float32Array (Matrix3 .Identity));
				}
			}
			else
			{
				gl .uniform1i (this .x3d_Lighting, false);

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
						gl .uniformMatrix3fv (this .x3d_NormalMatrix, false, normalMatrix);
					}
					catch (error)
					{
						gl .uniformMatrix3fv (this .x3d_NormalMatrix, false, new Float32Array (Matrix3 .Identity));
					}
				}
			}

			if (textureNode)
			{
				textureNode .traverse (gl, this, 0);
				textureTransformNode [0] .traverse ();

				gl .uniformMatrix4fv (this .x3d_TextureMatrix, false, textureTransformNode [0] .getMatrixArray ());
			}
			else
			{
				this .textureTypeArray [0] = 0;
				gl .uniform1iv (this .x3d_TextureType, this .textureTypeArray);

				if (this .getCustom ())
				{
					textureTransformNode [0] .traverse ();
					gl .uniformMatrix4fv (this .x3d_TextureMatrix, false, textureTransformNode [0] .getMatrixArray ());
				}
			}

			gl .uniformMatrix4fv (this .x3d_ModelViewMatrix, false, modelViewMatrix);
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
