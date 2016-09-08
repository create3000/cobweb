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
	"cobweb/Components/Core/X3DNode",
	"cobweb/Rendering/X3DRenderer",
	"cobweb/Components/Layering/X3DViewportNode",
	"cobweb/Execution/BindableStack",
	"cobweb/Execution/BindableList",
	"cobweb/Components/Navigation/NavigationInfo",
	"cobweb/Components/EnvironmentalEffects/Fog",
	"cobweb/Components/EnvironmentalEffects/Background",
	"cobweb/Bits/X3DCast",
	"cobweb/Bits/TraverseType",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Geometry/Line3",
	"standard/Math/Numbers/Vector3",
],
function ($,
          X3DNode,
          X3DRenderer,
          X3DViewportNode,
          BindableStack,
          BindableList,
          NavigationInfo,
          Fog,
          Background,
          X3DCast,
          TraverseType,
          X3DConstants,
          Line3,
          Vector3)
{
"use strict";

	var line = new Line3 (new Vector3 (0, 0, 0), new Vector3 (0, 0, 0));

	function X3DLayerNode (executionContext, defaultViewpoint, groupNode)
	{
		X3DNode     .call (this, executionContext);
		X3DRenderer .call (this, executionContext);

		this .addType (X3DConstants .X3DLayerNode);

		this .groupNode       = groupNode;
		this .currentViewport = null;

		this .defaultBackground     = new Background (executionContext);
		this .defaultFog            = new Fog (executionContext);
		this .defaultNavigationInfo = new NavigationInfo (executionContext);
		this .defaultViewpoint      = defaultViewpoint;

		this .backgroundStack     = new BindableStack (executionContext, this, this .defaultBackground);
		this .fogStack            = new BindableStack (executionContext, this, this .defaultFog);
		this .navigationInfoStack = new BindableStack (executionContext, this, this .defaultNavigationInfo);
		this .viewpointStack      = new BindableStack (executionContext, this, this .defaultViewpoint);

		this .backgrounds     = new BindableList (executionContext, this, this .defaultBackground)
		this .fogs            = new BindableList (executionContext, this, this .defaultFog);
		this .navigationInfos = new BindableList (executionContext, this, this .defaultNavigationInfo);
		this .viewpoints      = new BindableList (executionContext, this, this .defaultViewpoint);

		this .defaultBackground .setHidden (true);
		this .defaultFog        .setHidden (true);

		this .hitRay        = line;
		this .collisionTime = 0;
	}

	X3DLayerNode .prototype = $.extend (Object .create (X3DNode .prototype),
		X3DRenderer .prototype,
	{
		constructor: X3DLayerNode,
		layer0: false,
		initialize: function ()
		{
			X3DNode     .prototype .initialize .call (this);
			X3DRenderer .prototype .initialize .call (this);

			this .groupNode .children_ = this .children_;
			this .groupNode .setup ();
			this .collect = this .groupNode .traverse .bind (this .groupNode);

			this .defaultNavigationInfo .setup ();
			this .defaultBackground     .setup ();
			this .defaultFog            .setup ();
			this .defaultViewpoint      .setup ();

			this .backgroundStack     .setup ();
			this .fogStack            .setup ();
			this .navigationInfoStack .setup ();
			this .viewpointStack      .setup ();
	
			this .backgrounds     .setup ();
			this .fogs            .setup ();
			this .navigationInfos .setup ();
			this .viewpoints      .setup ();

			this .viewport_       .addInterest (this, "set_viewport__");
			this .addChildren_    .addFieldInterest (this .groupNode .addChildren_);
			this .removeChildren_ .addFieldInterest (this .groupNode .removeChildren_);
			this .children_       .addFieldInterest (this .groupNode .children_);

			this .set_viewport__ ();
		},
		isLayer0: function (value)
		{
			this .layer0 = value;
			this .defaultBackground .setHidden (! value);
		},
		getGroup: function ()
		{
			return this .groupNode;
		},
		getViewport: function ()
		{
			return this .currentViewport;
		},
		getBackground: function ()
		{
			return this .backgroundStack .top ();
		},
		getFog: function ()
		{
			return this .fogStack .top ();
		},
		getNavigationInfo: function ()
		{
			return this .navigationInfoStack .top ();
		},
		getViewpoint: function ()
		{
			return this .viewpointStack .top ();
		},
		getBackgrounds: function ()
		{
			return this .backgrounds;
		},
		getFogs: function ()
		{
			return this .fogs;
		},
		getNavigationInfos: function ()
		{
			return this .navigationInfos;
		},
		getViewpoints: function ()
		{
			return this .viewpoints;
		},
		getUserViewpoints: function ()
		{
			var userViewpoints = [ ];

			for (var i = 0; i < this .viewpoints .get () .length; ++ i)
			{
				var viewpoint = this .viewpoints .get () [i];

				if (viewpoint .description_ .length)
					userViewpoints .push (viewpoint);
			}

			return userViewpoints;
		},
		getBackgroundStack: function ()
		{
			return this .backgroundStack;
		},
		getFogStack: function ()
		{
			return this .fogStack;
		},
		getNavigationInfoStack: function ()
		{
			return this .navigationInfoStack;
		},
		getViewpointStack: function ()
		{
			return this .viewpointStack;
		},
		getHitRay: function ()
		{
			return this .hitRay;
		},
		getBBox: function (bbox)
		{
			return this .groupNode .getBBox (bbox);
		},
		set_viewport__: function ()
		{
			this .currentViewport = X3DCast (X3DConstants .X3DViewportNode, this .viewport_);

			if (! this .currentViewport)
				this .currentViewport = this .getBrowser () .getDefaultViewport ();
		},
		bind: function ()
		{
			this .traverse (TraverseType .CAMERA);

			// Bind first viewpoint in viewpoint list.

			this .navigationInfoStack .forcePush (this .navigationInfos .getBound ());
			this .backgroundStack     .forcePush (this .backgrounds     .getBound ());
			this .fogStack            .forcePush (this .fogs            .getBound ());
			this .viewpointStack      .forcePush (this .viewpoints      .getBound ());
		},
		traverse: function (type)
		{
		   var browser = this .getBrowser ();

			browser .getLayers () .push (this);

			switch (type)
			{
				case TraverseType .POINTER:
					this .pointer ();
					break;
				case TraverseType .CAMERA:
					this .camera ();
					break;
				case TraverseType .COLLISION:
					this .collision ();
					break;
				case TraverseType .DISPLAY:
					this .display ();
					break;
			}

			browser .getLayers () .pop ();
		},
		pointer: function ()
		{
			if (this .isPickable_ .getValue ())
			{
				var viewport = this .currentViewport .getRectangle ();

				if (this .getBrowser () .getSelectedLayer ())
				{
					if (this .getBrowser () .getSelectedLayer () !== this)
						return;
				}
				else
				{
					if (! this .getBrowser () .isPointerInRectangle (viewport))
						return;
				}

				this .getViewpoint () .reshape ();
				this .getViewpoint () .transform ();

				this .hitRay = this .getBrowser () .setHitRay (viewport);

				this .currentViewport .push ();
				this .collect (TraverseType .POINTER);
				this .currentViewport .pop ();
			}
		},
		camera: function ()
		{
			this .getViewpoint () .reshape ();
			this .getBrowser () .getModelViewMatrix () .identity ();

			this .currentViewport .push ();
			this .collect (TraverseType .CAMERA);
			this .currentViewport .pop ();

			this .navigationInfos .update ();
			this .backgrounds     .update ();
			this .fogs            .update ();
			this .viewpoints      .update ();

			this .getViewpoint () .update ();
		},
		collision: function ()
		{
			this .collisionTime = 0;

			this .getViewpoint () .reshape ();
			this .getBrowser () .getModelViewMatrix () .identity ();

			// Render
			this .currentViewport .push ();
			this .render (TraverseType .COLLISION);
			this .currentViewport .pop ();
		},
		display: function (type)
		{
			this .getNavigationInfo () .enable ();
			this .getViewpoint ()      .reshape ();
			this .getViewpoint ()      .transform ();

			this .currentViewport .push ();
			this .render (TraverseType .DISPLAY);
			this .currentViewport .pop ();
		},
		collect: function (type)
		{
			// Taken from group.traverse.
		},
	});

	return X3DLayerNode;
});


