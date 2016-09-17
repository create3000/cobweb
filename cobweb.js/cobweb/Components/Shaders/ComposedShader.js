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
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DShaderNode, 
          X3DProgrammableShaderObject, 
          LoadSensor,
          X3DCast,
          X3DConstants)
{
"use strict";

	var shader = null;

	function ComposedShader (executionContext)
	{
		X3DShaderNode               .call (this, executionContext);
		X3DProgrammableShaderObject .call (this, executionContext);

		this .addType (X3DConstants .ComposedShader);

		this .loadSensor = new LoadSensor (executionContext);
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

			this .getExecutionContext () .isLive () .addInterest (this, "set_live__");
			this .isLive () .addInterest (this, "set_live__");

			this .activate_ .addInterest (this, "set_activate__");
			this .parts_    .addFieldInterest (this .loadSensor .watchList_);

			this .loadSensor .isLoaded_ .addInterest (this, "set_loaded__");
			this .loadSensor .watchList_ = this .parts_;
			this .loadSensor .setup ();

			//Must not call set_live__.
		},
		getValid: function ()
		{
			return this .isValid_ .getValue ();
		},
		getProgram: function ()
		{
			return this .program;
		},
		set_live__: function ()
		{
			if (this .getExecutionContext () .isLive () .getValue () && this .isLive () .getValue ())
			{
				if (this .getValid ())
				{
					this .use ();
					this .addShaderFields ();
				}
			}
			else
			{
				if (this .getValid ())
				{
					this .use ();
					this .removeShaderFields ();
				}
			}
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
				
				if (this .getValid ())
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
					this .bindAttributeLocations (gl, program);

					gl .linkProgram (program);

					valid = valid && gl .getProgramParameter (program, gl .LINK_STATUS);
				}
	
				if (valid != this .isValid_ .getValue ())
					this .isValid_ = valid;

				if (valid)
				{
					// Initialize uniform variables
					this .use ();

					this .getDefaultUniforms ();
					this .addShaderFields ();

					// Debug
					// this .printProgramInfo ();
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
		setGlobalUniforms: function (gl, projectionMatrixArray)
		{
			if (shader !== this)
			{
				shader = this;

				gl .useProgram (this .program);
			}
			
			X3DProgrammableShaderObject .prototype .setGlobalUniforms .call (this, gl, projectionMatrixArray);
		},
		setLocalUniforms: function (gl, context)
		{
			if (shader !== this)
			{
				shader = this;

				gl .useProgram (this .program);
			}

			X3DProgrammableShaderObject .prototype .setLocalUniforms .call (this, gl, context);
		},
		use: function ()
		{
			if (shader !== this)
			{
				shader = this;

				this .getBrowser () .getContext () .useProgram (this .program);
			}
		},
	});

	return ComposedShader;
});
