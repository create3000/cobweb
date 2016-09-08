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
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Components/Grouping/X3DBoundedObject",
	"cobweb/Bits/TraverseType",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Geometry/Box3",
],
function ($,
	       Fields,
          X3DChildNode, 
          X3DBoundedObject, 
          TraverseType,
          X3DConstants,
          Box3)
{
"use strict";

	function remove (array, first, last, range, rfirst, rlast, getId)
	{
		if (! getId)
			getId = remove .getId ;

		var set = { };

		for (var i = rfirst; i < rlast; ++ i)
			set [getId (range [i])] = true;

		return remove_impl (array, first, last, set, getId);
	}

	function remove_impl (array, first, last, set, getId)
	{
		if ($.isEmptyObject (set))
			return last;

		var count = 0;

		for (; first !== last; ++ first)
		{
			if (set [getId (array [first])])
			{
				++ count;
				break;
			}
		}

		LOOP:
		for (; ;)
		{
			var second = first + count;

			for (; second !== last; ++ first, ++ second)
			{
				if (set [getId (array [second])])
				{
					++ count;
					continue LOOP;
				}

				array [first] = array [second];
			}

			break;
		}

		for (var second = first + count; second !== last; ++ first, ++ second)
		{
			array [first] = array [second];
		}

		return first;
	}

	remove .getId = function (value) { return value; };

	//

	//function getId (value) { return value ? value .getId () : -1; };
	function getNodeId (value) { return value ? value .getValue () .getId () : -1; }

	var visible = new Fields .MFBool ();

	function X3DGroupingNode (executionContext)
	{
		X3DChildNode     .call (this, executionContext);
		X3DBoundedObject .call (this, executionContext);

		this .addType (X3DConstants .X3DGroupingNode);
	               
		this .hidden                = false;
		this .pointingDeviceSensors = [ ];
		this .maybeCameraObjects    = [ ];
		this .cameraObjects         = [ ];
		this .clipPlanes            = [ ];
		this .localFogs             = [ ];
		this .lights                = [ ];
		this .childNodes            = [ ];
	}

	X3DGroupingNode .prototype = $.extend (Object .create (X3DChildNode .prototype),
		X3DBoundedObject .prototype,
	{
		constructor: X3DGroupingNode,
		initialize: function ()
		{
			X3DChildNode     .prototype .initialize .call (this);
			X3DBoundedObject .prototype .initialize .call (this);

			this .addChildren_    .addInterest (this, "set_addChildren__");
			this .removeChildren_ .addInterest (this, "set_removeChildren__");
			this .children_       .addInterest (this, "set_children__");

			this .set_children__ ();
		},
		getBBox: function (bbox)
		{
			if (this .bboxSize_ .getValue () .equals (this .defaultBBoxSize))
				return X3DBoundedObject .prototype .getBBox .call (this, this .children_ .getValue (), bbox);

			return box .set (this .bboxSize_ .getValue (), this .bboxCenter_ .getValue ());
		},
		setHidden: function (value)
		{
			if (value !== this .hidden)
			{
				this .hidden = value;

				this .set_children__ ();
			}
		},
		getVisible: function ()
		{
			return visible;
		},
		getChild: function (index)
		{
			// Used in LOD and Switch.
			
			try
			{
				if (index >= 0 && index < this .children_ .length)
				{
					var child = this .children_ [index];

					if (child)
						return child .getValue () .getInnerNode ();
				}
			}
			catch (error)
			{ }

			return null;
		},
		set_addChildren__: function ()
		{
			if (this .addChildren_ .length === 0)
				return;

			this .addChildren_ .setTainted (true);
			this .addChildren_ .erase (remove (this .addChildren_, 0, this .addChildren_ .length,
			                                   this .children_,    0, this .children_    .length,
			                                   getNodeId),
			                           this .addChildren_ .length);

			if (! this .children_ .getTainted ())
			{
				this .children_ .removeInterest (this, "set_children__");
				this .children_ .addInterest (this, "connectChildren");
			}

			this .children_ .insert (this .children_ .length, this .addChildren_, 0, this .addChildren_ .length);
			this .add (this .addChildren_);

			this .addChildren_ .set ([ ]);
			this .addChildren_ .setTainted (false);
		},
		set_removeChildren__: function ()
		{
			if (this .removeChildren_ .length === 0)
				return;

			if (this .children_ .length === 0)
				return;

			if (! this .children_ .getTainted ())
			{
				this .children_ .removeInterest (this, "set_children__");
				this .children_ .addInterest (this, "connectChildren");
			}

			this .children_ .erase (remove (this .children_,       0, this .children_ .length,
			                                this .removeChildren_, 0, this .removeChildren_ .length,
			                                getNodeId),
			                        this .children_ .length);

			this .removeChildren_ .set ([ ]);
			
			this .set_children__ ();
		},
		set_children__: function ()
		{
			this .clear ();
			this .add (this .children_);
		},
		connectChildren: function ()
		{
			this .children_ .removeInterest (this, "connectChildren");
			this .children_ .addInterest (this, "set_children__");
		},
		add: function (children)
		{
			if (this .hidden)
				return;

			var
				visible    = this .getVisible (),
				numVisible = visible .length;

			for (var i = 0, length = children .length; i < length; ++ i)
			{
				var child = children [i];

				if (child && (i >= numVisible || visible [i]))
				{
					try
					{
						var
							innerNode = child .getValue () .getInnerNode (),
							type      = innerNode .getType ();

						for (var t = type .length - 1; t >= 0; -- t)
						{
							switch (type [t])
							{
								case X3DConstants .X3DPointingDeviceSensorNode:
								{
									this .pointingDeviceSensors .push (innerNode);
									break;
								}
								case X3DConstants .ClipPlane:
								{
									this .clipPlanes .push (innerNode);
									break;
								}
								case X3DConstants .LocalFog:
								{
									this .localFogs .push (innerNode);
									break;
								}
								case X3DConstants .X3DLightNode:
								{
									this .lights .push (innerNode);
									break;
								}
								case X3DConstants .X3DBindableNode:
								{
									this .maybeCameraObjects .push (innerNode);
									break;				
								}
								case X3DConstants .X3DBackgroundNode:
								case X3DConstants .X3DChildNode:
								{
									innerNode .isCameraObject_ .addInterest (this, "set_cameraObjects__");

									this .maybeCameraObjects .push (innerNode);
									this .childNodes .push (innerNode);
									break;
								}
								case X3DConstants .BooleanFilter:
								case X3DConstants .BooleanToggle:
								case X3DConstants .NurbsOrientationInterpolator:
								case X3DConstants .NurbsPositionInterpolator:
								case X3DConstants .NurbsSurfaceInterpolator:
								case X3DConstants .TimeSensor:
								case X3DConstants .X3DFollowerNode:
								case X3DConstants .X3DInfoNode:
								case X3DConstants .X3DInterpolatorNode:
								case X3DConstants .X3DLayoutNode:
								case X3DConstants .X3DScriptNode:
								case X3DConstants .X3DSequencerNode:
								case X3DConstants .X3DTriggerNode:
									break;
								default:
									continue;
							}

							break;
						}
					}
					catch (error)
					{ }
				}
			}

			this .set_cameraObjects__ ();
		},
		clear: function ()
		{
			for (var i = 0, length = this .childNodes .length; i < length; ++ i)
				this .childNodes [i] .isCameraObject_ .removeInterest (this, "set_cameraObjects__");
			
			this .pointingDeviceSensors .length = 0;
			this .maybeCameraObjects    .length = 0;
			this .cameraObjects         .length = 0;
			this .clipPlanes            .length = 0;
			this .localFogs             .length = 0;
			this .lights                .length = 0;
			this .childNodes            .length = 0;
		},
		set_cameraObjects__: function ()
		{
			this .cameraObjects .length = 0;

			for (var i = 0, length = this .maybeCameraObjects .length; i < length; ++ i)
			{
				var childNode = this .maybeCameraObjects [i];

				if (childNode .getCameraObject ())
					this .cameraObjects .push (childNode);
			}

			this .setCameraObject (this .cameraObjects .length);
		},
		traverse: function (type)
		{
			switch (type)
			{
				case TraverseType .POINTER:
				{
					var
						pointingDeviceSensors = this .pointingDeviceSensors,
						clipPlanes            = this .clipPlanes,
						childNodes            = this .childNodes;

					if (pointingDeviceSensors .length)
					{
						var sensors = { };
						
						this .getBrowser () .getSensors () .push (sensors);
					
						for (var i = 0, length = pointingDeviceSensors .length; i < length; ++ i)
							pointingDeviceSensors [i] .traverse (sensors);
					}

					for (var i = 0, length = clipPlanes .length; i < length; ++ i)
						clipPlanes [i] .push ();

					for (var i = 0, length = childNodes .length; i < length; ++ i)
						childNodes [i] .traverse (type);

					for (var i = 0, length = clipPlanes .length; i < length; ++ i)
						clipPlanes [i] .pop ();

					if (pointingDeviceSensors .length)
						this .getBrowser () .getSensors () .pop ();

					return;
				}
				case TraverseType .CAMERA:
				{
					var cameraObjects = this .cameraObjects;

					for (var i = 0, length = cameraObjects .length; i < length; ++ i)
						cameraObjects [i] .traverse (type);

					return;
				}
				case TraverseType .COLLISION:
				{					
					var
						clipPlanes = this .clipPlanes,
						childNodes = this .childNodes;

					for (var i = 0, length = clipPlanes .length; i < length; ++ i)
						clipPlanes [i] .push ();

					for (var i = 0, length = childNodes .length; i < length; ++ i)
						childNodes [i] .traverse (type);

					for (var i = 0, length = clipPlanes .length; i < length; ++ i)
						clipPlanes [i] .pop ();
					
					return;
				}
				case TraverseType .DISPLAY:
				{
					var
						clipPlanes = this .clipPlanes,
						localFogs  = this .localFogs,
						lights     = this .lights,
						childNodes = this .childNodes;

					for (var i = 0, length = clipPlanes .length; i < length; ++ i)
						clipPlanes [i] .push ();

					for (var i = 0, length = localFogs .length; i < length; ++ i)
						localFogs [i] .push ();

					for (var i = 0, length = lights .length; i < length; ++ i)
						lights [i] .push ();

					for (var i = 0, length = childNodes .length; i < length; ++ i)
						childNodes [i] .traverse (type);
					
					for (var i = 0, length = lights .length; i < length; ++ i)
						lights [i] .pop ();

					for (var i = 0, length = localFogs .length; i < length; ++ i)
						localFogs [i] .pop ();

					for (var i = 0, length = clipPlanes .length; i < length; ++ i)
						clipPlanes [i] .pop ();

					return;
				}
			}
		},
	});

	return X3DGroupingNode;
});


