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

﻿
define ([
	"jquery",
	"cobweb/Browser/Navigation/X3DViewer",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Rotation4",
	"standard/Math/Numbers/Matrix4",
	"standard/Math/Geometry/Camera",
	"jquery-mousewheel",
],
function ($, X3DViewer, Vector3, Rotation4, Matrix4, Camera)
{
"use strict";
	
	var
		SPEED_FACTOR           = 0.007,
		SHIFT_SPEED_FACTOR     = 4 * SPEED_FACTOR,
		ROTATION_SPEED_FACTOR  = 1.4,
		ROTATION_LIMIT         = 40,
		PAN_SPEED_FACTOR       = SPEED_FACTOR,
		PAN_SHIFT_SPEED_FACTOR = 1.4 * PAN_SPEED_FACTOR,
		ROLL_ANGLE             = Math .PI / 32,
		ROLL_TIME              = 0.2;

	var
		yAxis     = new Vector3 (0, 1, 0),
		zAxis     = new Vector3 (0, 0, 1),
		black     = new Float32Array ([0, 0, 0]),
		white     = new Float32Array ([1, 1, 1]),
		fromPoint = new Vector3 (0, 0, 0),
		toPoint   = new Vector3 (0, 0, 0),
		upVector  = new Vector3 (0, 0, 0);
	
	var
		MOVE = 0,
		PAN  = 1;
	
	function X3DFlyViewer (executionContext)
	{
		X3DViewer .call (this, executionContext);

		var gl = this .getBrowser () .getContext ();

		this .button              = -1;
		this .fromVector          = new Vector3 (0, 0, 0);
		this .toVector            = new Vector3 (0, 0, 0);
		this .direction           = new Vector3 (0, 0, 0);
		this .sourceRotation      = new Rotation4 (0, 0, 1, 0);
		this .destinationRotation = new Rotation4 (0, 0, 1, 0);
		this .startTime           = 0;
		this .lineBuffer          = gl .createBuffer ();
		this .lineCount           = 2;
		this .lineVertices        = new Array (this .lineCount * 4);
		this .lineArray           = new Float32Array (this .lineVertices);

		this .projectionMatrix      = new Matrix4 ();
		this .projectionMatrixArray = new Float32Array (this .projectionMatrix);
		this .modelViewMatrixArray  = new Float32Array (this .projectionMatrix);
	}

	X3DFlyViewer .prototype = $.extend (Object .create (X3DViewer .prototype),
	{
		constructor: X3DFlyViewer,
		initialize: function ()
		{
			X3DViewer .prototype .initialize .call (this);

			var canvas = this .getBrowser () .getCanvas ();

			canvas .bind ("mousedown.X3DFlyViewer",  this .mousedown  .bind (this));
			canvas .bind ("mouseup.X3DFlyViewer",    this .mouseup    .bind (this));
			canvas .bind ("mousewheel.X3DFlyViewer", this .mousewheel .bind (this));
		},
		addCollision: function () { },
		removeCollision: function () { },
		mousedown: function (event)
		{
			if (this .button >= 0)
				return;
		
			var
				offset = this .getBrowser () .getCanvas () .offset (),
				x      = event .pageX - offset .left,
				y      = event .pageY - offset .top;
			
			switch (event .button)
			{
				case 0:
				{
					this .button = event .button;
				
					$(document) .bind ("mouseup.X3DFlyViewer"   + this .getId (), this .mouseup   .bind (this));
					$(document) .bind ("mousemove.X3DFlyViewer" + this .getId (), this .mousemove .bind (this));
		
					event .stopImmediatePropagation ();
					this .disconnect ();
					this .getActiveViewpoint () .transitionStop ();
					this .getBrowser () .setCursor ("MOVE");
					this .addCollision ();

					if (this .getBrowser () .hasCtrlKey ())
					{
						// Look around.

						this .fromVector = this .trackballProjectToSphere (x, y);
					}
					else
					{
						// Move.

						this .fromVector .set (x, 0, y);
						this .toVector   .assign (this .fromVector);
						this .direction  .set (0, 0, 0);

						if (this .getBrowser () .getBrowserOption ("Rubberband"))
							this .getBrowser () .finished () .addInterest (this, "display", MOVE);
					}

					break;
				}
				case 1:
				{
					this .button = event .button;
				
					$(document) .bind ("mouseup.X3DFlyViewer"   + this .getId (), this .mouseup   .bind (this));
					$(document) .bind ("mousemove.X3DFlyViewer" + this .getId (), this .mousemove .bind (this));
		
					event .stopImmediatePropagation ();
					this .disconnect ();
					this .getActiveViewpoint () .transitionStop ();
					this .getBrowser () .setCursor ("MOVE");
					this .addCollision ();

					this .fromVector .set (x, -y, 0);
					this .toVector   .assign (this .fromVector);

					if (this .getBrowser () .getBrowserOption ("Rubberband"))
						this .getBrowser () .finished () .addInterest (this, "display", PAN);
					
					break;
				}
			}
		},
		mouseup: function (event)
		{
			if (event .button !== this .button)
				return;

			this .button = -1;
		
			$(document) .unbind ("mousemove.X3DFlyViewer" + this .getId ());
			$(document) .unbind ("mouseup.X3DFlyViewer"   + this .getId ());

			this .disconnect ();
			this .getBrowser () .setCursor ("DEFAULT");
			this .removeCollision ();
		},
		mousemove: function (event)
		{
			this .getBrowser () .addBrowserEvent ();

			var
				offset = this .getBrowser () .getCanvas () .offset (),
				x      = event .pageX - offset .left,
				y      = event .pageY - offset .top;
			
			switch (this .button)
			{
				case 0:
				{
					if (this .getBrowser () .hasCtrlKey ())
					{
						// Look around

						var
							viewpoint   = this .getActiveViewpoint (),
							orientation = viewpoint .getUserOrientation (),
							toVector    = this .trackballProjectToSphere (x, y);

						orientation = new Rotation4 (toVector, this .fromVector) .multRight (orientation);
						viewpoint .straightenHorizon (orientation);

						viewpoint .orientationOffset_ = viewpoint .getOrientation () .copy () .inverse () .multRight (orientation);

						this .fromVector .assign (toVector);
					}
					else
					{
						// Fly

						this .toVector  .set (x, 0, y);
						this .direction .assign (this .toVector) .subtract (this .fromVector);

						this .addFly ();
					}
				
					break;
				}
				case 1:
				{
					// Pan
					event .stopImmediatePropagation ();

					this .toVector  .set (x, -y, 0);
					this .direction .assign (this .toVector) .subtract (this .fromVector);

					this .addPan ();
					break;
				}
			}
		},
		mousewheel: function (event)
		{
			// Stop event propagation.
			event .preventDefault (); // XXX: put into PointingDevice
			event .stopImmediatePropagation ();

			// Determine scroll direction.

			var direction = 0;

			// IE & Opera
			if (event .originalEvent .wheelDelta)
				direction = -event .originalEvent .wheelDelta / 120;

			// Mozilla
			else if (event .originalEvent .detail)
				direction = event .originalEvent .detail / 3;

			// Change viewpoint position.

			var viewpoint = this .getActiveViewpoint ();

			viewpoint .transitionStop ();

			if (direction < 0)
			{
				this .sourceRotation .assign (viewpoint .orientationOffset_ .getValue ());
				this .destinationRotation = this .sourceRotation .multRight (new Rotation4 (viewpoint .getUserOrientation () .multVecRot (new Vector3 (-1, 0, 0)), ROLL_ANGLE));
				this .addRoll ();
			}

			else if (direction > 0)
			{
				this .sourceRotation .assign (viewpoint .orientationOffset_ .getValue ());
				this .destinationRotation = this .sourceRotation .multRight (new Rotation4 (viewpoint .getUserOrientation () .multVecRot (new Vector3 (1, 0, 0)), ROLL_ANGLE));
				this .addRoll ();
			}
		},
		fly: function ()
		{
			var
				now = performance .now (),
				dt  = (now - this .startTime) / 1000;

			var
				navigationInfo = this .getNavigationInfo (),
				viewpoint      = this .getActiveViewpoint ();

			upVector .assign (viewpoint .getUpVector ());

			// Rubberband values

			var up = new Rotation4 (yAxis, upVector);

			var rubberBandRotation = this .direction .z > 0
			                         ? new Rotation4 (up .multVecRot (this .direction .copy ()), up .multVecRot (zAxis .copy ()))
			                         : new Rotation4 (up .multVecRot (Vector3 .negate (zAxis)), up .multVecRot (this .direction .copy ()));

			var rubberBandLength = this .direction .abs ();

			// Position offset

			var speedFactor = 1 - rubberBandRotation .angle / (Math .PI / 2);

			speedFactor *= navigationInfo .speed_ .getValue ();
			speedFactor *= viewpoint .getSpeedFactor ();
			speedFactor *= this .getBrowser () .hasShiftKey () ? SHIFT_SPEED_FACTOR : SPEED_FACTOR;
			speedFactor *= dt;

			var translation = this .getTranslationOffset (Vector3 .multiply (this .direction, speedFactor));

			viewpoint .positionOffset_ = this .getActiveLayer () .constrainTranslation (translation) .add (viewpoint .positionOffset_ .getValue ());

			// Rotation

			var weight = ROTATION_SPEED_FACTOR * dt;
			weight *= Math .pow (rubberBandLength / (rubberBandLength + ROTATION_LIMIT), 2);

			viewpoint .orientationOffset_ = new Rotation4 () .slerp (rubberBandRotation, weight) .multLeft (viewpoint .orientationOffset_ .getValue ());

			// GeoRotation

			var geoRotation = new Rotation4 (upVector, viewpoint .getUpVector ());

			viewpoint .orientationOffset_ = geoRotation .multLeft (viewpoint .orientationOffset_ .getValue ());

			this .startTime = now;
		},
		pan: function ()
		{
			var
				now = performance .now (),
				dt  = (now - this .startTime) / 1000;

			var
				navigationInfo = this .getNavigationInfo (),
				viewpoint      = this .getActiveViewpoint (),
				upVector       = viewpoint .getUpVector ();

			var speedFactor = 1;

			speedFactor *= navigationInfo .speed_ .getValue ();
			speedFactor *= viewpoint .getSpeedFactor ();
			speedFactor *= this .getBrowser () .hasShiftKey () ? PAN_SHIFT_SPEED_FACTOR : PAN_SPEED_FACTOR;
			speedFactor *= dt;

			var
				orientation = viewpoint .getUserOrientation () .multRight (new Rotation4 (viewpoint .getUserOrientation () .multVecRot (yAxis .copy ()), upVector)),
				translation = orientation .multVecRot (this .direction .copy () .multiply (speedFactor));

			viewpoint .positionOffset_ = this .getActiveLayer () .constrainTranslation (translation) .add (viewpoint .positionOffset_ .getValue ());

			this .startTime = now;
		},
		roll: function ()
		{
			var
				now          = performance .now (),
				elapsedTime  = (now - this .startTime) / 1000;

			if (elapsedTime > ROLL_TIME)
				return this .disconnect ();

			var viewpoint = this .getActiveViewpoint ();

			viewpoint .orientationOffset_ = Rotation4 .slerp (this .sourceRotation, this .destinationRotation, elapsedTime / ROLL_TIME);
		},
		addFly: function ()
		{
			if (this .startTime)
				return;

			this .getBrowser () .prepareEvents () .addInterest (this, "fly");
			this .getBrowser () .addBrowserEvent ();

			this .startTime = performance .now ();
		},
		addPan: function ()
		{
			if (this .startTime)
				return;
			
			this .getBrowser () .prepareEvents () .addInterest (this, "pan");
			this .getBrowser () .addBrowserEvent ();

			this .startTime = performance .now ();
		},
		addRoll: function ()
		{
			if (this .startTime)
				return;
			
			this .getBrowser () .prepareEvents () .addInterest (this, "roll");
			this .getBrowser () .addBrowserEvent ();
			
			this .startTime = performance .now ();
		},
		display: function (interest, type)
		{
			// Configure HUD

			var
				browser  = this .getBrowser (),
				viewport = browser .getViewport (),
				width    = viewport [2],
				height   = viewport [3];

			Camera .ortho (0, width, 0, height, -1, 1, this .projectionMatrix);

			this .projectionMatrixArray .set (this .projectionMatrix);

			// Display Rubberband.

			if (type === MOVE)
			{
				fromPoint .set (this .fromVector .x, height - this .fromVector .z, 0);
				toPoint   .set (this .toVector   .x, height - this .toVector   .z, 0);
			}
			else
			{
				fromPoint .set (this .fromVector .x, height + this .fromVector .y, 0);
				toPoint   .set (this .toVector   .x, height + this .toVector   .y, 0);
			}

			this .transfer (fromPoint, toPoint);

			var
				gl        = browser .getContext (),
				shader    = browser .getLineShader (),
				lineWidth = gl .getParameter (gl .LINE_WIDTH);

			shader .use ();

			gl .uniform4fv (shader .x3d_ClipPlane [0], shader .noClipPlane);

			gl .uniform1i (shader .x3d_FogType,       0);
			gl .uniform1i (shader .x3d_ColorMaterial, false);
			gl .uniform1i (shader .x3d_Lighting,      true);

			gl .uniformMatrix4fv (shader .x3d_ProjectionMatrix, false, this .projectionMatrixArray);
			gl .uniformMatrix4fv (shader .x3d_ModelViewMatrix,  false, this .modelViewMatrixArray);
			
			gl .disable (gl .DEPTH_TEST);

			// Draw a black and a white line.
			gl .lineWidth (2);
			gl .uniform3fv (shader .x3d_EmissiveColor, black);
			gl .uniform1f  (shader .x3d_Transparency,  0);

			shaderNode .enableVertexAttribute (gl, this .lineBuffer);

			gl .drawArrays (gl .LINES, 0, this .lineCount);

			gl .lineWidth (1);
			gl .uniform3fv (shader .x3d_EmissiveColor, white);

			gl .drawArrays (gl .LINES, 0, this .lineCount);
			gl .enable (gl .DEPTH_TEST);

			gl .lineWidth (lineWidth);
		},
		transfer: function (fromPoint, toPoint)
		{
			var
				gl           = this .getBrowser () .getContext (),
				lineVertices = this .lineVertices;

			lineVertices [0] = fromPoint .x;
			lineVertices [1] = fromPoint .y;
			lineVertices [2] = fromPoint .z;
			lineVertices [3] = 1;

			lineVertices [4] = toPoint .x;
			lineVertices [5] = toPoint .y;
			lineVertices [6] = toPoint .z;
			lineVertices [7] = 1;

			this .lineArray .set (lineVertices);

			// Transfer line.

			gl .bindBuffer (gl .ARRAY_BUFFER, this .lineBuffer);
			gl .bufferData (gl .ARRAY_BUFFER, this .lineArray, gl .STATIC_DRAW);
		},
		disconnect: function ()
		{
			var browser = this .getBrowser ();

			browser .addBrowserEvent ();

			browser .prepareEvents () .removeInterest (this, "fly");
			browser .prepareEvents () .removeInterest (this, "pan");
			browser .prepareEvents () .removeInterest (this, "roll");
			browser .finished ()      .removeInterest (this, "display");

			this .startTime = 0;
		},
		dispose: function ()
		{
			this .disconnect ();
			this .getBrowser () .getCanvas () .unbind (".X3DFlyViewer");
			$(document) .unbind (".X3DFlyViewer" + this .getId ());
		},
	});

	return X3DFlyViewer;
});
