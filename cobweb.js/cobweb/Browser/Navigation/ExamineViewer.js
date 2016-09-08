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
	"cobweb/Browser/Navigation/X3DViewer",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Rotation4",
	"lib/gettext",
	"jquery-mousewheel",
],
function ($, X3DViewer, Vector3, Rotation4, _)
{
"use strict";

	var
		MOTION_TIME       = 0.05 * 1000,
		SPIN_RELEASE_TIME = 0.01 * 1000,
		SPIN_ANGLE        = 0.006,
		SPIN_FACTOR       = 0.6,
		SCROLL_FACTOR     = 1.0 / 50.0,
		FRAME_RATE        = 60;

	function ExamineViewer (executionContext)
	{
		X3DViewer .call (this, executionContext);

		this .button            = -1;
		this .orientationOffset = new Rotation4 (0, 0, 1, 0);
		this .rotation          = new Rotation4 (0, 0, 1, 0);
		this .fromVector        = new Vector3 (0, 0, 0);
		this .fromPoint         = new Vector3 (0, 0, 0);
		this .pressTime         = 0;
		this .motionTime        = 0;
		this .spinId            = undefined;
	}

	ExamineViewer .prototype = $.extend (Object .create (X3DViewer .prototype),
	{
		constructor: ExamineViewer,
		initialize: function ()
		{
			X3DViewer .prototype .initialize .call (this);

			var
			   browser = this .getBrowser (),
			   canvas  = browser .getCanvas ();

			canvas .bind ("mousedown.ExamineViewer",  this .mousedown  .bind (this));
			canvas .bind ("mouseup.ExamineViewer",    this .mouseup    .bind (this));
			canvas .bind ("dblclick.ExamineViewer",   this .dblclick  .bind (this));
			canvas .bind ("mousewheel.ExamineViewer", this .mousewheel .bind (this));
		},
		mousedown: function (event)
		{
			if (this .button >= 0)
				return;
		
			this .pressTime = performance .now ();

			var
				offset = this .getBrowser () .getCanvas () .offset (),
				x      = event .pageX - offset .left,
				y      = event .pageY - offset .top;

			switch (event .button)
			{
				case 0:
				{
					this .button = event .button;
					
					$(document) .bind ("mouseup.ExamineViewer"   + this .getId (), this .mouseup   .bind (this));
					$(document) .bind ("mousemove.ExamineViewer" + this .getId (), this .mousemove .bind (this));

					event .stopImmediatePropagation ();
					this .disconnect ();
					this .getActiveViewpoint () .transitionStop ();
					this .getBrowser () .setCursor ("MOVE");

					this .fromVector = this .trackballProjectToSphere (x, y);
					this .rotation   = new Rotation4 ();

					this .motionTime = 0;			
					break;
				}
				case 1:
				{
					this .button = event .button;
					
					this .getBrowser () .getCanvas () .unbind ("mousemove.ExamineViewer");

					$(document) .bind ("mouseup.ExamineViewer"   + this .getId (), this .mouseup   .bind (this));
					$(document) .bind ("mousemove.ExamineViewer" + this .getId (), this .mousemove .bind (this));
		
					event .stopImmediatePropagation ();
					this .disconnect ();
					this .getActiveViewpoint () .transitionStop ();
					this .getBrowser () .setCursor ("MOVE");

					this .fromPoint = this .getPointOnCenterPlane (x, y);
					break;
				}
			}
		},
		mouseup: function (event)
		{
			if (event .button !== this .button)
				return;

			this .button = -1;
		
			$(document) .unbind ("mousemove.ExamineViewer" + this .getId ());
			$(document) .unbind ("mouseup.ExamineViewer"   + this .getId ());

			switch (event .button)
			{
				case 0:
				{
					event .stopImmediatePropagation ();
					this .getBrowser () .setCursor ("DEFAULT");

					if (Math .abs (this .rotation .angle) > SPIN_ANGLE && performance .now () - this .motionTime < SPIN_RELEASE_TIME)
					{
						try
						{
							this .rotation = new Rotation4 (0, 0, 1, 0) .slerp (this .rotation, SPIN_FACTOR);
							this .addSpinning ();
						}
						catch (error)
						{ }
					}

					break;
				}
				case 1:
				{
					event .stopImmediatePropagation ();
					this .getBrowser () .setCursor ("DEFAULT");
					break;
				}
			}
		},
		dblclick: function (event)
		{
			var
				offset = this .getBrowser () .getCanvas () .offset (), 
				x      = event .pageX - offset .left,
				y      = this .getBrowser () .getCanvas () .height () - (event .pageY - offset .top);

			event .stopImmediatePropagation ();

			this .lookAt (x, y);
		},
		mousemove: function (event)
		{
			var
				offset = this .getBrowser () .getCanvas () .offset (),
				x      = event .pageX - offset .left,
				y      = event .pageY - offset .top;

			switch (this .button)
			{
				case 0:
				{
					var
						viewpoint = this .getActiveViewpoint (),
						toVector  = this .trackballProjectToSphere (x, y);

					this .rotation = new Rotation4 (toVector, this .fromVector);

					if (Math .abs (this .rotation .angle) < SPIN_ANGLE && performance .now () - this .pressTime < MOTION_TIME)
						return false;

					viewpoint .orientationOffset_ = this .getOrientationOffset ();
					viewpoint .positionOffset_    = this .getPositionOffset ();

					this .fromVector = toVector;
					this .motionTime = performance .now ();
					break;
				}
				case 1:
				{
					// Stop event propagation.

					event .stopImmediatePropagation ();

					// Move.

					var
						viewpoint   = this .getActiveViewpoint (),
						toPoint     = this .getPointOnCenterPlane (x, y),
						translation = viewpoint .getUserOrientation () .multVecRot (Vector3 .subtract (this .fromPoint, toPoint));

					viewpoint .positionOffset_         = Vector3 .add (viewpoint .positionOffset_         .getValue (), translation);
					viewpoint .centerOfRotationOffset_ = Vector3 .add (viewpoint .centerOfRotationOffset_ .getValue (), translation);

					this .fromPoint = toPoint;
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

			//viewpoint .transitionStop ();

			var
				step           = this .getDistanceToCenter () .multiply (SCROLL_FACTOR),
				positionOffset = viewpoint .getUserOrientation () .multVecRot (new Vector3 (0, 0, step .abs ()));

			if (direction < 0)
				viewpoint .positionOffset_ = viewpoint .positionOffset_ .getValue () .subtract (positionOffset);		
			
			else if (direction > 0)
				viewpoint .positionOffset_ = viewpoint .positionOffset_ .getValue () .add (positionOffset);
		},
		getPositionOffset: function ()
		{
			var
				viewpoint = this .getActiveViewpoint (),
				distance  = this .getDistanceToCenter ();

			return (this .orientationOffset .copy () .inverse ()
			        .multRight (viewpoint .orientationOffset_ .getValue ())
			        .multVecRot (distance .copy ())
			        .subtract (distance)
			        .add (viewpoint .positionOffset_ .getValue ()));
		},
		getOrientationOffset: function ()
		{
			var viewpoint = this .getActiveViewpoint ();

			this .orientationOffset .assign (viewpoint .orientationOffset_ .getValue ());

			return viewpoint .getOrientation () .copy () .inverse () .multRight (this .rotation) .multRight (viewpoint .getUserOrientation ());
		},
		spin: function ()
		{
			var viewpoint = this .getActiveViewpoint ();

			viewpoint .orientationOffset_ = this .getOrientationOffset ();
			viewpoint .positionOffset_    = this .getPositionOffset ();
		},
		addSpinning: function ()
		{
			if (! this .spinId)
				this .spinId = setInterval (this .spin .bind (this), 1000.0 / FRAME_RATE);
		},
		disconnect: function ()
		{
			clearInterval (this .spinId);

			this .spinId = undefined;
		},
		dispose: function ()
		{
			this .disconnect ();
			this .getBrowser () .getCanvas () .unbind (".ExamineViewer");
			$(document) .unbind (".ExamineViewer" + this .getId ());
		},
	});

	return ExamineViewer;
});
