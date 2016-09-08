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
	"cobweb/Components/Shape/X3DMaterialNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Algorithm",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DMaterialNode, 
          X3DConstants,
          Algorithm)
{
"use strict";

	function Material (executionContext)
	{
		X3DMaterialNode .call (this, executionContext);

		this .addType (X3DConstants .Material);
			
		this .diffuseColor  = new Float32Array (3);
		this .specularColor = new Float32Array (3);
		this .emissiveColor = new Float32Array (3);
	}

	Material .prototype = $.extend (Object .create (X3DMaterialNode .prototype),
	{
		constructor: Material,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",         new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "ambientIntensity", new Fields .SFFloat (0.2)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "diffuseColor",     new Fields .SFColor (0.8, 0.8, 0.8)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "specularColor",    new Fields .SFColor ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "emissiveColor",    new Fields .SFColor ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "shininess",        new Fields .SFFloat (0.2)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "transparency",     new Fields .SFFloat ()),
		]),
		getTypeName: function ()
		{
			return "Material";
		},
		getComponentName: function ()
		{
			return "Shape";
		},
		getContainerField: function ()
		{
			return "material";
		},
		initialize: function ()
		{
			X3DMaterialNode .prototype .initialize .call (this);

			this .addChildren ("transparent", new Fields .SFBool ());

			this .ambientIntensity_ .addInterest (this, "set_ambientIntensity__");
			this .diffuseColor_     .addInterest (this, "set_diffuseColor__");
			this .specularColor_    .addInterest (this, "set_specularColor__");
			this .emissiveColor_    .addInterest (this, "set_emissiveColor__");
			this .shininess_        .addInterest (this, "set_shininess__");
			this .transparency_     .addInterest (this, "set_transparency__");
	
			this .set_ambientIntensity__ ();
			this .set_diffuseColor__ ();
			this .set_specularColor__ ();
			this .set_emissiveColor__ ();
			this .set_shininess__ ();
			this .set_transparency__ ();
		},
		getSeparateBackColor: function ()
		{
		   return false;
		},
		set_ambientIntensity__: function ()
		{
			this .ambientIntensity = Math .max (this .ambientIntensity_ .getValue (), 0);
		},
		set_diffuseColor__: function ()
		{
			this .diffuseColor .set (this .diffuseColor_ .getValue ());
		},
		set_specularColor__: function ()
		{
			this .specularColor .set (this .specularColor_ .getValue ());
		},
		set_emissiveColor__: function ()
		{
			this .emissiveColor .set (this .emissiveColor_ .getValue ());
		},
		set_shininess__: function ()
		{
			this .shininess = Algorithm .clamp (this .shininess_ .getValue (), 0, 1);
		},
		set_transparency__: function ()
		{
			var transparency = Algorithm .clamp (this .transparency_ .getValue (), 0, 1);

			this .transparency = transparency;

			if (transparency != this .transparent_ .getValue ())
				this .transparent_ = transparency;
		},
	});

	return Material;
});


