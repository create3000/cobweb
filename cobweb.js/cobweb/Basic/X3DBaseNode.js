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
	"cobweb/Base/X3DEventObject",
	"cobweb/Base/Events",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Fields",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DEventObject,
          Events,
          X3DFieldDefinition,
          FieldDefinitionArray,
          Fields,
          X3DConstants)
{
"use strict";

	function isLive ()
	{
	   return this .isLive_;
	}

	function X3DBaseNode (executionContext)
	{
		if (this .hasOwnProperty ("_executionContext"))
			return;

		X3DEventObject .call (this, executionContext .getBrowser ());

		this ._executionContext  = executionContext;
		this ._type              = [ X3DConstants .X3DBaseNode ];
		this ._fields            = { };
		this ._predefinedFields  = { };
		this ._userDefinedFields = { };

		// Setup fields.

		if (this .hasUserDefinedFields ())
			this .fieldDefinitions = new FieldDefinitionArray (this .fieldDefinitions .getValue () .slice ());

		var fieldDefinitions = this .fieldDefinitions .getValue ();

		for (var i = 0, length = fieldDefinitions .length; i < length; ++ i)
			this .addField (fieldDefinitions [i]);
	}

	X3DBaseNode .prototype = $.extend (Object .create (X3DEventObject .prototype),
	{
		constructor: X3DBaseNode,
		fieldDefinitions: new FieldDefinitionArray ([ ]),
		_live: true,
		_initialized: false,
		getScene: function ()
		{
			var executionContext = this ._executionContext;

			while (! executionContext .isRootContext ())
				executionContext = executionContext .getExecutionContext ();

			return executionContext;
		},
		getExecutionContext: function ()
		{
			return this ._executionContext;
		},
		addType: function (value)
		{
			this ._type .push (value);
		},
		getType: function ()
		{
			return this ._type;
		},
		getInnerNode: function ()
		{
			return this;
		},
		isLive: function ()
		{
			///  Returns the live event of this node.

			// Change function.

			this .isLive = isLive;

			// Add isLive event.

			this .addChildren ("isLive", new Fields .SFBool (this .getLiveState ()));

			// Event processing is done manually and immediately, so:
			this .isLive_ .removeParent (this);

			if (this ._executionContext !== this)
				this ._executionContext .isLive () .addInterest (this, "_set_live__");

			return this .isLive ();
		},
		setLive: function (value)
		{
			///  Sets the own live state of this node.  Setting the live state to false
			///  temporarily disables this node completely.

			this ._live = value .valueOf ();

			this ._set_live__ ();
		},
		getLive: function ()
		{
			///  Returns the own live state of this node.

			return this ._live;
		},
		getLiveState: function ()
		{
			///  Determines the live state of this node.

			if (this !== this ._executionContext)
				return this .getLive () && this ._executionContext .isLive () .getValue ();

			return this .getLive ();
		},
		_set_live__: function ()
		{
			var
				live   = this .getLiveState (),
				isLive = this .isLive ();

			if (live)
			{
				if (isLive .getValue ())
					return;

				isLive .setValue (true);
				isLive .processEvent (Events .create (isLive));
			}
			else
			{
				if (isLive .getValue ())
				{
					isLive .setValue (false);
					isLive .processEvent (Events .create (isLive));
				}
			}
		},
		isInitialized: function ()
		{
			return this ._initialized;
		},
		setup: function ()
		{
			if (this ._initialized)
				return;

			this ._initialized = true;

			var fieldDefinitions = this .fieldDefinitions .getValue ();

			for (var i = 0, length = fieldDefinitions .length; i < length; ++ i)
			{
				var field = this ._fields [fieldDefinitions [i] .name];
				field .updateReferences ();
				field .setTainted (false);
			}

			this .initialize ();
		},
		initialize: function () { },
		eventsProcessed: function () { },
		create: function (executionContext)
		{
			return new (this .constructor) (executionContext);
		},
		copy: function (executionContext)
		{
			// First try to get a named node with the node's name.

			var name = this .getName ();
		
			if (name .length)
			{
				try
				{
					return executionContext .getNamedNode (name) .getValue ();
				}
				catch (error)
				{ }
			}

			// Create copy.

			var copy = this .create (executionContext);

			if (name .length)
				executionContext .updateNamedNode (name, copy);

			// Default fields

			var predefinedFields = this .getPredefinedFields ();

			for (var name in predefinedFields)
			{
				try
				{
					var
						sourceField = predefinedFields [name],
						destfield   = copy .getField (name);

					destfield .setSet (sourceField .getSet ());

					//if (sourceField .getAccessType () === destfield .getAccessType () and sourceField .getType () === destfield .getType ())
					//{

					if (sourceField .hasReferences ())
					{
						var references = sourceField .getReferences ();

						// IS relationship
						for (var id in references)
						{
							try
							{
								var originalReference = references [id];
	
								destfield .addReference (executionContext .getField (originalReference .getName ()));
							}
							catch (error)
							{
								console .error (error .message);
							}
						}
					}
					else
					{
						if (sourceField .getAccessType () & X3DConstants .initializeOnly)
						{
							switch (sourceField .getType ())
							{
								case X3DConstants .SFNode:
								case X3DConstants .MFNode:
									destfield .set (sourceField .copy (executionContext) .getValue ());
									break;
								default:
									destfield .set (sourceField .getValue ());
									break;
							}
						}
					}
				}
				catch (error)
				{
					console .log (error .message);
				}
			}

			// User-defined fields

			var userDefinedFields = this .getUserDefinedFields ();

			for (var name in userDefinedFields)
			{
				var
					sourceField = userDefinedFields [name],
					destfield   = sourceField .copy (executionContext);

				copy .addUserDefinedField (sourceField .getAccessType (),
				                           sourceField .getName (),
				                           destfield);

				destfield .setSet (sourceField .getSet ());

				if (sourceField .hasReferences ())
				{
					// IS relationship

					var references = sourceField .getReferences ();

					for (var id in references)
					{
						try
						{
							var originalReference = references [id];
	
							destfield .addReference (executionContext .getField (originalReference .getName ()));
						}
						catch (error)
						{
							console .error ("No reference '" + originalReference .getName () + "' inside execution context " + executionContext .getTypeName () + " '" + executionContext .getName () + "'.");
						}
					}
				}
			}

			executionContext .addUninitializedNode (copy);
			return copy;
		},
		addChildren: function (name, field)
		{
			for (var i = 0, length = arguments .length; i < length; i += 2)
				this .addChild (arguments [i + 0], arguments [i + 1]);
		},
		addChild: function (name, field)
		{
			field .addParent (this);
			field .setName (name);

			Object .defineProperty (this, name + "_",
			{
				get: function () { return this; } .bind (field),
				set: field .setValue .bind (field),
				enumerable: true,
				configurable: false,
			});
		},
		addField: function (fieldDefinition)
		{
			var
				accessType = fieldDefinition .accessType,
				name       = fieldDefinition .name,
				field      = fieldDefinition .value .clone ();

			field .setTainted (true);
			field .addParent (this);
			field .setName (name);
			field .setAccessType (accessType);

			this .setField (name, field);
		},
		setField: function (name, field, userDefined)
		{
			if (field .getAccessType () === X3DConstants .inputOutput)
			{
				this ._fields ["set_" + name]     = field;
				this ._fields [name + "_changed"] = field;
			}

			this ._fields [name] = field;

			if (userDefined)
			{
				this ._userDefinedFields [name] = field;
				return;
			}

			this ._predefinedFields [name] = field;

			Object .defineProperty (this, name + "_",
			{
				get: function () { return this; } .bind (field),
				set: field .setValue .bind (field),
				enumerable: true,
				configurable: true, // false : non deleteable
			});
		},
		removeField: function (name /*, completely */)
		{
			var field = this ._fields [name];

			//if (completely && field .getAccessType () === X3DConstants .inputOutput)
			//{
			//	delete this ._fields ["set_" + field .getName ()];
			//	delete this ._fields [field .getName () + "_changed"];
			//}

			delete this ._fields [name];
			delete this ._userDefinedFields [name];

			var fieldDefinitions = this .fieldDefinitions .getValue ();

			for (var i = 0, length = fieldDefinitions .length; i < length; ++ i)
			{
				if (fieldDefinitions [i] .name === name)
				{
					fieldDefinitions .splice (i, 1);
					break;
				}
			}
		},
		getField: function (name)
		{
			var field = this ._fields [name];
			
			if (field)
				return field;

			throw new Error ("Unkown field '" + name + "' in node class " + this .getTypeName () + ".");
		},
		getFieldDefinitions: function ()
		{
			return this .fieldDefinitions;
		},
		hasUserDefinedFields: function ()
		{
			return false;
		},
		addUserDefinedField: function (accessType, name, field)
		{
			if (this ._fields [name])
				this .removeField (name);

			field .setTainted (true);
			field .addParent (this);
			field .setName (name);
			field .setAccessType (accessType);

			this .fieldDefinitions .getValue () .push (new X3DFieldDefinition (accessType, name, field));

			this .setField (name, field, true);
		},
		getUserDefinedFields: function ()
		{
			return this ._userDefinedFields;
		},
		getPredefinedFields: function ()
		{
			return this ._predefinedFields;
		},
		getFields: function ()
		{
			return this ._fields;
		},
		getCDATA: function ()
		{
			return null;
		},
		traverse: function () { },
		toString: function ()
		{
			return this .getTypeName () + " { }";
		},
		dispose: function ()
		{
			// TODO: remove named node if any. (do this in NamedNode)
			// TODO: remove improted node if any. (do this in ImportedNode)
			// TODO: remove exported node if any. (do this in ExportedNode)
			// TODO: remove routes from and to node if any. (do this in Route)

			var
				predefinedFields  = this .getPredefinedFields (),
				userDefinedFields = this .getUserDefinedFields ();

			for (var name in predefinedFields)
				predefinedFields [name] .dispose ();

			for (var name in userDefinedFields)
				userDefinedFields [name] .dispose ();

			// Remove node from entire scene graph.

			var firstParents = this .getParents ();

			for (var firstId in firstParents)
			{
				var firstParent = firstParents [firstId];

				if (firstParent instanceof Fields .SFNode)
				{
					var secondParents = firstParent .getParents ();

					for (var secondId in secondParents)
					{
						var secondParent = secondParents [secondId];

						if (secondParent instanceof Fields .MFNode)
						{
							var length = secondParent .length;

							secondParent .erase (secondParent .remove (0, length, firstParent), length);
						}
					}

					firstParent .setValue (null);
				}
			}
		},
	});

	X3DBaseNode .prototype .addAlias = X3DBaseNode .prototype .setField;

	return X3DBaseNode;
});
