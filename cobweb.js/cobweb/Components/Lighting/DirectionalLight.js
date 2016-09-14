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
	"cobweb/Components/Lighting/X3DLightNode",
	"cobweb/Components/Grouping/X3DGroupingNode",
	"cobweb/Bits/TraverseType",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Geometry/Box3",
	"standard/Math/Geometry/Camera",
	"standard/Math/Geometry/ViewVolume",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Vector4",
	"standard/Math/Numbers/Rotation4",
	"standard/Math/Numbers/Matrix4",
	"standard/Utility/ObjectCache",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DLightNode,
          X3DGroupingNode,
          TraverseType,
          X3DConstants,
          Box3,
          Camera,
          ViewVolume,
          Vector3,
          Vector4,
          Rotation4,
          Matrix4,
          ObjectCache)
{
"use strict";

	var DirectionalLights = ObjectCache (DirectionalLightContainer);
	
	function DirectionalLightContainer (lightNode, groupNode)
	{
		this .direction            = new Vector3 (0, 0, 0);
		this .shadowBuffer         = null;
		this .bbox                 = new Box3 ();
		this .viewVolume           = new ViewVolume (Matrix4 .Identity, Vector4 .Zero, Vector4 .Zero);
		this .viewport             = new Vector4 (0, 0, 0, 0);
		this .projectionMatrix     = new Matrix4 ();
		this .modelViewMatrix      = new Matrix4 ();
		this .transformationMatrix = new Matrix4 ();
		this .invLightSpaceMatrix  = new Matrix4 ();
		this .shadowMatrix         = new Matrix4 ();
		this .shadowMatrixArray    = new Float32Array (16);
		this .rotation             = new Rotation4 ();
		this .textureUnit          = 0;
	
		this .set (lightNode, groupNode);
	}

	DirectionalLightContainer .prototype =
	{
		constructor: DirectionalLightContainer,
		set: function (lightNode, groupNode)
		{
			var
				browser       = lightNode .getBrowser (),
				gl            = browser .getContext (),
				shadowMapSize = lightNode .getShadowMapSize ();

			this .lightNode = lightNode;
			this .groupNode = groupNode;

			this .modelViewMatrix .assign (browser.getModelViewMatrix () .get ());

			if (lightNode .getShadowIntensity () > 0 && shadowMapSize > 0)
			{
				this .shadowBuffer = browser .popShadowBuffer (shadowMapSize);

				if (this .shadowBuffer)
				{
					if (browser .getCombinedTextureUnits () .length)
					{
						this .textureUnit = browser .getCombinedTextureUnits () .pop ();

						gl .activeTexture (gl .TEXTURE0 + this .textureUnit);
						gl .bindTexture (gl .TEXTURE_2D, this .shadowBuffer .getDepthTexture ());
						gl .activeTexture (gl .TEXTURE0);
					}
					else
					{
						console .warn ("Not enough combined texture units for shadow map available.");
					}
				}
				else
				{
					console .warn ("Couldn't create shadow buffer.");
				}
			}
		},
		renderShadowMap: function ()
		{
			try
			{
				if (! this .shadowBuffer)
					return;

				var
					lightNode            = this .lightNode,
					browser              = lightNode .getBrowser (),
					layerNode            = lightNode .getCurrentLayer (),
					cameraSpaceMatrix    = lightNode .getCurrentViewpoint () .getCameraSpaceMatrix (),
					transformationMatrix = this .transformationMatrix .assign (this .modelViewMatrix) .multRight (cameraSpaceMatrix),
					invLightSpaceMatrix  = this .invLightSpaceMatrix  .assign (lightNode .getGlobal () ? transformationMatrix : Matrix4 .Identity);

				invLightSpaceMatrix .rotate (this .rotation .setFromToVec (Vector3 .zAxis, this .direction .assign (lightNode .getDirection ()) .negate ()));
				invLightSpaceMatrix .inverse ();

				var
					groupBBox        = X3DGroupingNode .prototype .getBBox .call (this .groupNode, this .bbox), // Group bbox.
					lightBBox        = groupBBox .multRight (invLightSpaceMatrix),                              // Group bbox from the perspective of the light.
					shadowMapSize    = lightNode .getShadowMapSize (),
					viewport         = this .viewport .set (0, 0, shadowMapSize, shadowMapSize),
					projectionMatrix = Camera .orthoBox (lightBBox, this .projectionMatrix);

				this .shadowBuffer .bind ();

				layerNode .getViewVolumes () .push (this .viewVolume .set (projectionMatrix, viewport, viewport));
				browser .getProjectionMatrix () .pushMatrix (projectionMatrix);
				browser .getModelViewMatrix  () .pushMatrix (invLightSpaceMatrix);
				browser .getModelViewMatrix  () .multLeft (Matrix4 .inverse (this .groupNode .getMatrix ()));

				layerNode .render (this .groupNode, TraverseType .DEPTH);

				browser .getModelViewMatrix  () .pop ();
				browser .getProjectionMatrix () .pop ();
				layerNode .getViewVolumes () .pop ();

				this .shadowBuffer .unbind ();
	
				if (! lightNode .getGlobal ())
					invLightSpaceMatrix .multLeft (transformationMatrix .inverse ());

				this .shadowMatrix .assign (cameraSpaceMatrix) .multRight (invLightSpaceMatrix) .multRight (projectionMatrix) .multRight (lightNode .getBiasMatrix ());
			}
			catch (error)
			{
				// Catch error from matrix inverse.
				console .log (error);
			}
		},
		setShaderUniforms: function (gl, shaderObject, i)
		{
			var
				lightNode   = this .lightNode,
				color       = lightNode .getColor (),
				direction   = this .modelViewMatrix .multDirMatrix (this .direction .assign (lightNode .getDirection ())) .normalize (),
				shadowColor = lightNode .getShadowColor ();

			gl .uniform1i (shaderObject .x3d_LightType [i],             1);
			gl .uniform3f (shaderObject .x3d_LightColor [i],            color .r, color .g, color .b);
			gl .uniform1f (shaderObject .x3d_LightIntensity [i],        lightNode .getIntensity ());
			gl .uniform1f (shaderObject .x3d_LightAmbientIntensity [i], lightNode .getAmbientIntensity ());
			gl .uniform3f (shaderObject .x3d_LightDirection [i],        direction .x, direction .y, direction .z);

			if (this .textureUnit)
			{
				this .shadowMatrixArray .set (this .shadowMatrix);

				gl .uniform1f        (shaderObject .x3d_ShadowIntensity [i],     lightNode .getShadowIntensity ());
				gl .uniform1f        (shaderObject .x3d_ShadowDiffusion [i],     lightNode .getShadowDiffusion ());
				gl .uniform3f        (shaderObject .x3d_ShadowColor [i],         shadowColor .r, shadowColor .g, shadowColor .b);
				gl .uniformMatrix4fv (shaderObject .x3d_ShadowMatrix [i], false, this .shadowMatrixArray);
				gl .uniform1i        (shaderObject .x3d_ShadowMap [i],           this .textureUnit);
			}
			else
				gl .uniform1f (shaderObject .x3d_ShadowIntensity [i], 0);
		},
		recycle: function ()
		{
			if (this .textureUnit)
			{
				this .lightNode .getBrowser () .getCombinedTextureUnits () .push (this .textureUnit);
				this .lightNode .getBrowser () .pushShadowBuffer (this .shadowBuffer);

				this .shadowBuffer = null;
				this .textureUnit  = 0;
			}

		   DirectionalLights .push (this);
		},
	};

	function DirectionalLight (executionContext)
	{
		X3DLightNode .call (this, executionContext);

		this .addType (X3DConstants .DirectionalLight);
	}

	DirectionalLight .prototype = $.extend (Object .create (X3DLightNode .prototype),
	{
		constructor: DirectionalLight,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",         new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "global",           new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "on",               new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "color",            new Fields .SFColor (1, 1, 1)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "intensity",        new Fields .SFFloat (1)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "ambientIntensity", new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "direction",        new Fields .SFVec3f (0, 0, -1)),

			new X3DFieldDefinition (X3DConstants .inputOutput,    "shadowColor",     new  Fields .SFColor ()),        // Color of shadow.
			new X3DFieldDefinition (X3DConstants .inputOutput,    "shadowIntensity", new  Fields .SFFloat ()),        // Intensity of shadow color in the range (0, 1).
			new X3DFieldDefinition (X3DConstants .inputOutput,    "shadowDiffusion", new  Fields .SFFloat ()),        // Diffusion of the shadow in length units in the range (0, inf).
			new X3DFieldDefinition (X3DConstants .initializeOnly, "shadowMapSize",   new  Fields .SFInt32 (1024)),    // Size of the shadow map in pixels in the range (0, inf).
		]),
		getTypeName: function ()
		{
			return "DirectionalLight";
		},
		getComponentName: function ()
		{
			return "Lighting";
		},
		getContainerField: function ()
		{
			return "children";
		},
		getLights: function ()
		{
			return DirectionalLights;
		},
	});

	return DirectionalLight;
});


