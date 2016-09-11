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


define ("cobweb/Components/CubeMapTexturing/ComposedCubeMapTexture",
[
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/CubeMapTexturing/X3DEnvironmentTextureNode",
	"cobweb/Bits/X3DCast",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DEnvironmentTextureNode,
          X3DCast,
          X3DConstants)
{
"use strict";

   var defaultData = new Uint8Array ([ 255, 255, 255, 255 ]);

	function ComposedCubeMapTexture (executionContext)
	{
		X3DEnvironmentTextureNode .call (this, executionContext);

		this .addType (X3DConstants .ComposedCubeMapTexture);

		this .textures = [null, null, null, null, null, null];
	}

	ComposedCubeMapTexture .prototype = $.extend (Object .create (X3DEnvironmentTextureNode .prototype),
	{
		constructor: ComposedCubeMapTexture,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "front",    new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "back",     new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "left",     new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "right",    new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "bottom",   new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "top",      new Fields .SFNode ()),
		]),
		getTypeName: function ()
		{
			return "ComposedCubeMapTexture";
		},
		getComponentName: function ()
		{
			return "CubeMapTexturing";
		},
		getContainerField: function ()
		{
			return "texture";
		},
		initialize: function ()
		{
			X3DEnvironmentTextureNode .prototype .initialize .call (this);

			var gl = this .getBrowser () .getContext ();

			this .target = gl .TEXTURE_CUBE_MAP;

			this .targets = [
				gl .TEXTURE_CUBE_MAP_POSITIVE_Z, // Front
				gl .TEXTURE_CUBE_MAP_NEGATIVE_Z, // Back
				gl .TEXTURE_CUBE_MAP_NEGATIVE_X, // Left
				gl .TEXTURE_CUBE_MAP_POSITIVE_X, // Right
				gl .TEXTURE_CUBE_MAP_POSITIVE_Y, // Top
				gl .TEXTURE_CUBE_MAP_NEGATIVE_Y, // Bottom
			];

			this .getExecutionContext () .isLive () .addInterest (this, "set_live__");
			this .isLive () .addInterest (this, "set_live__");

			this .front_  .addInterest (this, "set_texture__", 0);
			this .back_   .addInterest (this, "set_texture__", 1);
			this .left_   .addInterest (this, "set_texture__", 2);
			this .right_  .addInterest (this, "set_texture__", 3);
			this .top_    .addInterest (this, "set_texture__", 5);
			this .bottom_ .addInterest (this, "set_texture__", 4);

			this .set_texture__ (this .front_,  0);
			this .set_texture__ (this .back_,   1);
			this .set_texture__ (this .left_,   2);
			this .set_texture__ (this .right_,  3);
			this .set_texture__ (this .top_,    4);
			this .set_texture__ (this .bottom_, 5);

			this .set_live__ ();
		},
		getTarget: function ()
		{
			return this .target;
		},
		set_live__: function ()
		{
			if (this .getExecutionContext () .isLive () .getValue () && this .isLive () .getValue ())
			{
				this .getBrowser () .getBrowserOptions () .TextureQuality_ .addInterest (this, "set_textureQuality__");
	
				this .set_textureQuality__ ();
			}
			else
				this .getBrowser () .getBrowserOptions () .TextureQuality_ .removeInterest (this, "set_textureQuality__");
		},
		set_textureQuality__: function ()
		{
			var textureProperties = this .getBrowser () .getDefaultTextureProperties ();

			this .updateTextureProperties (this .target, false, textureProperties, 128, 128, false, false, false);
		},
		set_texture__: function (node, index)
		{
			if (this .textures [index])
				this .textures [index] .loadState_ .removeInterest (this, "setTexture");

			var texture = this .textures [index] = X3DCast (X3DConstants .X3DTexture2DNode, node);

			if (texture)
				texture .loadState_ .addInterest (this, "setTexture", index, texture);

			this .setTexture (null, index, texture);
		},
		setTexture: function (output, index, texture)
		{
			var
				gl     = this .getBrowser () .getContext (),
				target = this .targets [index];

			this .set_transparent__ ();

			if (texture && texture .checkLoadState () == X3DConstants .COMPLETE_STATE)
			{
				var
					gl     = this .getBrowser () .getContext (),
					width  = texture .getWidth (),
					height = texture .getHeight (),
					data   = texture .getData ();

				gl .pixelStorei (gl .UNPACK_FLIP_Y_WEBGL, !texture .getFlipY ());
				gl .pixelStorei (gl .UNPACK_ALIGNMENT, 1);
				gl .bindTexture (this .target, this .getTexture ());
				gl .texImage2D (target, 0, gl .RGBA, width, height, false, gl .RGBA, gl .UNSIGNED_BYTE, data);
				gl .bindTexture (this .target, null);

				this .set_textureQuality__ ();
			}
			else
			{
				gl .bindTexture (this .target, this .getTexture ());
				gl .texImage2D (target, 0, gl .RGBA, 1, 1, false, gl .RGBA, gl .UNSIGNED_BYTE, defaultData);
				gl .bindTexture (this .target, null);
			}
		},
		set_transparent__: function ()
		{
			var
				textures    = this .textures,
				transparent = false;

			for (var i = 0; i < 6; ++ i)
			{
				var texture = textures [i];

				if (texture && texture .transparent_ .getValue ())
				{
					transparent = true;
					break;
				}
			}

			if (transparent !== this .transparent_ .getValue ())
				this .transparent_ = transparent;
		},
		traverse: function (gl, shader, i)
		{
			shader .textureTypeArray [i] = 4;
			gl .activeTexture (gl .TEXTURE1);
			gl .bindTexture (gl .TEXTURE_CUBE_MAP, this .getTexture ());
			gl .uniform1iv (shader .x3d_TextureType, shader .textureTypeArray);
		},
	});

	return ComposedCubeMapTexture;
});


