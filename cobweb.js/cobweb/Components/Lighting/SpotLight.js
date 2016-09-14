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
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Algorithm",
	"standard/Utility/ObjectCache",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DLightNode, 
          X3DConstants,
          Vector3,
          Algorithm,
          ObjectCache)
{
"use strict";

	var SpotLights = ObjectCache (SpotLightContainer);
	
	function SpotLightContainer (light)
	{
		this .location  = new Vector3 (0, 0, 0);
		this .direction = new Vector3 (0, 0, 0);

	   this .set (light);
	}

	SpotLightContainer .prototype =
	{
		constructor: SpotLightContainer,
	   set: function (light)
	   {
			var modelViewMatrix = light .getBrowser () .getModelViewMatrix () .get ();
	
			this .color            = light .getColor ();
			this .intensity        = light .getIntensity ();
			this .ambientIntensity = light .getAmbientIntensity ();
			this .attenuation      = light .attenuation_ .getValue ();
			this .radius           = light .getRadius ();
			this .beamWidth        = light .getBeamWidth ();
			this .cutOffAngle      = light .getCutOffAngle ();
	
			modelViewMatrix .multVecMatrix (this .location  .assign (light .location_  .getValue ()));
			modelViewMatrix .multDirMatrix (this .direction .assign (light .direction_ .getValue ())) .normalize ();
	   },
		setShaderUniforms: function (gl, shaderObject, i)
		{
			gl .uniform1i (shaderObject .x3d_LightType [i],             3);
			gl .uniform3f (shaderObject .x3d_LightColor [i],            this .color .r, this .color .g, this .color .b);
			gl .uniform1f (shaderObject .x3d_LightIntensity [i],        this .intensity);
			gl .uniform1f (shaderObject .x3d_LightAmbientIntensity [i], this .ambientIntensity);
			gl .uniform3f (shaderObject .x3d_LightAttenuation [i],      this .attenuation .x, this .attenuation .y, this .attenuation .z); // max
			gl .uniform3f (shaderObject .x3d_LightLocation [i],         this .location .x, this .location .y, this .location .z);
			gl .uniform3f (shaderObject .x3d_LightDirection [i],        this .direction .x, this .direction .y, this .direction .z);
			gl .uniform1f (shaderObject .x3d_LightRadius [i],           this .radius);
			gl .uniform1f (shaderObject .x3d_LightBeamWidth [i],        this .beamWidth);
			gl .uniform1f (shaderObject .x3d_LightCutOffAngle [i],      this .cutOffAngle);
		},
		recycle: function ()
		{
		   SpotLights .push (this);
		},
	};

	function SpotLight (executionContext)
	{
		X3DLightNode .call (this, executionContext);

		this .addType (X3DConstants .SpotLight);
	}

	SpotLight .prototype = $.extend (Object .create (X3DLightNode .prototype),
	{
		constructor: SpotLight,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",         new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "global",           new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "on",               new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "color",            new Fields .SFColor (1, 1, 1)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "intensity",        new Fields .SFFloat (1)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "ambientIntensity", new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "attenuation",      new Fields .SFVec3f (1, 0, 0)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "location",         new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "direction",        new Fields .SFVec3f (0, 0, -1)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "radius",           new Fields .SFFloat (100)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "beamWidth",        new Fields .SFFloat (0.785398)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "cutOffAngle",      new Fields .SFFloat (1.5708)),

			new X3DFieldDefinition (X3DConstants .inputOutput, "shadowColor",      new  Fields .SFColor ()),        // Color of shadow.
			new X3DFieldDefinition (X3DConstants .inputOutput, "shadowIntensity",  new  Fields .SFFloat ()),        // Intensity of shadow color in the range (0, 1).
			new X3DFieldDefinition (X3DConstants .inputOutput, "shadowDiffusion",  new  Fields .SFFloat ()),        // Diffusion of the shadow in length units in the range (0, inf).
			new X3DFieldDefinition (X3DConstants .inputOutput, "shadowMapSize",    new  Fields .SFInt32 (1024)),    // Size of the shadow map in pixels in the range (0, inf).
		]),
		getTypeName: function ()
		{
			return "SpotLight";
		},
		getComponentName: function ()
		{
			return "Lighting";
		},
		getContainerField: function ()
		{
			return "children";
		},
		getRadius: function ()
		{
			return Math .max (0, this .radius_ .getValue ());
		},
		getBeamWidth: function ()
		{
			// If the beamWidth is greater than the cutOffAngle, beamWidth is defined to be equal to the cutOffAngle.

			var
				beamWidth   = this .beamWidth_ .getValue (),
				cutOffAngle = this .getCutOffAngle ();

			if (beamWidth > cutOffAngle)
				return cutOffAngle;

			return Algorithm .clamp (beamWidth, 0, Math .PI / 2);
		},
		getCutOffAngle: function ()
		{
			return Algorithm .clamp (this .cutOffAngle_ .getValue (), 0, Math .PI / 2);
		},
		getLights: function ()
		{
			return SpotLights;
		},
	});

	return SpotLight;
});


