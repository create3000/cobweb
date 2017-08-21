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
	"../../Fields.js",
	"../../Basic/X3DFieldDefinition.js",
	"../../Basic/FieldDefinitionArray.js",
	"./X3DParticlePhysicsModelNode.js",
	"../../Bits/X3DConstants.js",
	"../../Bits/X3DCast.js",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DParticlePhysicsModelNode, 
          X3DConstants,
          X3DCast)
{
"use strict";

	function BoundedPhysicsModel (executionContext)
	{
		X3DParticlePhysicsModelNode .call (this, executionContext);

		this .addType (X3DConstants .BoundedPhysicsModel);
	}

	BoundedPhysicsModel .prototype = $.extend (Object .create (X3DParticlePhysicsModelNode .prototype),
	{
		constructor: BoundedPhysicsModel,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",  new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "geometry", new Fields .SFNode ()),
		]),
		getTypeName: function ()
		{
			return "BoundedPhysicsModel";
		},
		getComponentName: function ()
		{
			return "ParticleSystems";
		},
		getContainerField: function ()
		{
			return "physics";
		},
		initialize: function ()
		{
			X3DParticlePhysicsModelNode .prototype .initialize .call (this);

			this .geometry_ .addInterest ("set_geometry__", this);

			this .set_geometry__ ();
		},
		set_geometry__: function ()
		{
			if (this .geometryNode)
				this .geometryNode .removeInterest ("addNodeEvent", this);

			this .geometryNode = X3DCast (X3DConstants .X3DGeometryNode, this .geometry_);

			if (this .geometryNode)
				this .geometryNode .addInterest ("addNodeEvent", this);
		},
		addGeometry: function (boundedNormals, boundedVertices)
		{
			if (this .geometryNode)
			{
				var
					normals  = this .geometryNode .getNormals (),
					vertices = this .geometryNode .getVertices ();
	
				for (var i = 0, length = normals .length; i < length; ++ i)
					boundedNormals .push (normals [i]);
	
				for (var i = 0, length = vertices .length; i < length; ++ i)
					boundedVertices .push (vertices [i]);
			}
		},
	});

	return BoundedPhysicsModel;
});


