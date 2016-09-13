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


define ("cobweb/Components/PointingDeviceSensor/X3DPointingDeviceSensorNode",
[
	"jquery",
	"cobweb/Components/Core/X3DSensorNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector4",
	"standard/Math/Numbers/Matrix4",
],
function ($,
          X3DSensorNode, 
          X3DConstants,
          Vector4,
          Matrix4)
{
"use strict";

	function X3DPointingDeviceSensorNode (executionContext)
	{
		X3DSensorNode .call (this, executionContext);

		this .addType (X3DConstants .X3DPointingDeviceSensorNode);
	}

	X3DPointingDeviceSensorNode .prototype = $.extend (Object .create (X3DSensorNode .prototype),
	{
		constructor: X3DPointingDeviceSensorNode,
		initialize: function ()
		{
			X3DSensorNode .prototype .initialize .call (this);

			this .enabled_ .addInterest (this, "set_enabled__");

			this .matrices = { };
		},
		getMatrices: function ()
		{
			return this .matrices;
		},
		set_enabled__: function ()
		{
			if (this .enabled_ .getValue ())
				return;

			if (this .isActive_ .getValue ())
				this .isActive_ = false;

			if (this .isOver_ .getValue ())
				this .isOver_ = false;
		},
		set_over__: function (hit, value)
		{
			if (value !== this .isOver_ .getValue ())
			{
				this .isOver_ = value;

				if (this .isOver_ .getValue ())
					this .getBrowser () .getNotification () .string_ = this .description_;
			}
		},
		set_active__: function (hit, value)
		{
			if (value !== this .isActive_ .getValue ())
				this .isActive_ = value;
		},
		traverse: function (sensors)
		{
			if (this .enabled_ .getValue ())
			{
				var currentLayer = this .getCurrentLayer ();

				sensors [this .getId ()] = this;

				// Create a matrix set for each layer if needed in the case the sensor is cloned over multiple layers.

				if (! (currentLayer .getId () in this .matrices))
				{
					this .matrices [currentLayer .getId ()] = {
						modelViewMatrix:  new Matrix4 (),
						projectionMatrix: new Matrix4 (),
						viewport:         new Vector4 (),
					};
				}

				var matrices = this .matrices [currentLayer .getId ()];

				matrices .modelViewMatrix  .assign (this .getBrowser () .getModelViewMatrix  () .get ());
				matrices .projectionMatrix .assign (this .getBrowser () .getProjectionMatrix () .get ());
				matrices .viewport         .assign (currentLayer .getViewport () .getRectangle ());
			}
		},
	});

	return X3DPointingDeviceSensorNode;
});


